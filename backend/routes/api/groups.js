const express = require("express");
const { requireAuth, restoreUser } = require("../../utils/auth");
const {
  validateEvent,
  validateGroup,
  validateVenue,
} = require("../../utils/validateAll");
const {
  Group,
  Membership,
  User,
  Image,
  Event,
  Attendance,
  Venue,
} = require("../../db/models");
const { Op } = require('sequelize');

const router = express.Router();


// //Get all events of a group by id
router.get("/:groupId/events", async (req, res) => {
  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group could not be found",
      statusCode: 404,
    });
  }

  const Events = await Event.findAll({
    where: { groupId },
    include: [
      {
        model: Attendance,
      },
      {
        model: Group,
        attributes: ["id", "name", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "city", "state"],
      },
    ],
    attributes:{
      exclude: ['price', 'description', 'capacity', 'endDate']
    }

  });

  Events.forEach(function(event)
       {event.dataValues.numAttending = event.dataValues.Attendances.length,
        delete event.dataValues.Attendances;
        }
    );

  return res.json({
    Events,
  });
});



//Create an event for a Group
router.post( "/:groupId/events",requireAuth,validateEvent,async (req, res) => {
    const { user } = req;

    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    const group = await Group.findByPk(groupId);

    if (!group) {
      res.status(404);
      return res.json({
        message: "Group could not be found",
        statusCode: 404,
      });
    }

    const status = await Membership.findOne({
      where: { memberId: user.id, groupId },
    });

    if (user.id === group.organizerId || status.status === "co-host") {
      const event = await Event.create({
        groupId: groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      });

      const newAttendance = await Attendance.create({
        userId: user.id,
        eventId: event.id,
        status: 'attending'
       });

      return res.json(event);
    } else {
      res.status(403);
      return res.json({
        message: "Forbidden",
        statusCode: 403,
      });
    }
  }
);



//Create Venue for Group
router.post("/:groupId/venues",requireAuth,validateVenue, async (req, res) => {
    const { user } = req;
    const { address, city, state, lat, lng } = req.body;
    console.log(req.body);

    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);

    if (!group) {
      res.status(404);
      return res.json({
        message: "Group could not be found",
        statusCode: 404,
      });
    }

    const member = await Membership.findOne({
      where: { memberId: user.id, groupId },
    });


    if (user.id === group.organizerId || member.status === "co-host") {
      const newVenue = await Venue.create({
        groupId: groupId,
        address,
        city,
        state,
        lat,
        lng,
      });

      const venue = await Venue.findOne({
        where: {id: newVenue.id },
        attributes: {
         exclude:
          ["createdAt", "updatedAt"]
        }
    });
      return res.json(venue);
    } else {
      res.status(403);
      return res.json({
        message: "Forbidden",
        statusCode: 403,
      });
    }
  }
);

//Get all members of a Group Specified by it's Id
router.get("/:groupId/membership", restoreUser, async (req, res) => {
  const { user } = req;
  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group could not be found",
      statusCode: 404,
    });
  }

  let Members;

  if (user && user.id === group.organizerId) {
    Members = await Group.findByPk(groupId, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
          through: {
            attributes: ["status"],
          },
        },
      ],
    });
  } else {
    Members = await Group.findByPk(groupId, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
          through: {
            attributes: ["status"],
            where: {
              status: {
                [Op.not]: "pending",
              },
            },
          },
        },
      ],
    });
  }

  return res.json({ Members: Members.Users });
});

//Request membership for a Group based on the Group's id
router.post("/:groupId/membership", requireAuth, restoreUser, async (req, res) => {
  const { user } = req;

  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group could not be found",
      statusCode: 404,
    });
  }

  const member = await Membership.findOne({
    where: {
      memberId: user.id,
      groupId,
    },
  });


  if (member) {
    if (member.status === "pending") {
      res.status(400);
      return res.json({
        message: "Membership has already been requested",
        statusCode: 400,
      });
    }

    if (member.status === "member") {
      res.status(400);
      return res.json({
        message: "User is already a member of the group",
        statusCode: 400,
      });
    }

    if (member.status === "host") {
      res.status(400);
      return res.json({
        message: "User is already a member of the group",
        statusCode: 400,
      });
    }
  } else {
    const reqMembership = await Membership.create({
      memberId: user.id,
      groupId,
      status: "pending",
    });

    const newMember = await Membership.findOne({
      where: {
        memberId: user.id,
        groupId,
      },
      attributes:{
        exclude: ['id', 'createdAt', 'updatedAt']
      },
    });
    return res.json(
      newMember
    );
  }
});


//Change status of membership for a group specified by Id
router.put("/:groupId/membership", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { groupId } = req.params;
  const { memberId, status } = req.body;

  const group = await Group.findByPk(groupId);
  const member = await Membership.findOne({
    where: {
      memberId: user.id,
      groupId,
    },
  });

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group could not be found",
      statusCode: 404,
    });
  }

  if (status === "pending") {
    res.status(404);
    return res.json({
      message: "Cannot change a membership status to pending",
      statusCode: 400,
    });
  }

  if (user.id !== group.organizerId) {
    if (status === "co-host") {
      const err = new Error(
        "Current User must be the organizer to add a co-host"
      );
      err.status = 403;
      err.message = "Current User must be the organizer to add a co-host";
      return next(err);
    }
  }

  if (member.status !== "host" && member.status !== "co-host") {
    const err = new Error(
      "Current User must be the organizer or a co-host to make someone a member"
    );
    err.status = 400;
    err.message =
      "Current User must be the organizer or a co-host to make someone a member";
    return next(err);
  }

  const membership = await Membership.findOne({
    where: {
      memberId: memberId,
      groupId,
    },
  });

  if (!membership) {
    res.status(404);
    return res.json({
      message: "Membership between the user and the group does not exist",
      statusCode: 404,
    });
  }

  await membership.update({ status });

  const updated = await Membership.findOne(
    {
      where: {
        memberId: memberId,
        groupId: groupId
      },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  res.json(updated);
});

//Delete Membership to a group specified by id
router.delete("/:groupId/membership", requireAuth, async (req, res) => {
  const { user } = req;
  let { memberId } = req.body;
  memberId = parseInt(memberId);

  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group could not be found",
      statusCode: 404,
    });
  }

  const member = await Membership.findOne({
    where: {
      memberId,
      groupId,
    },
  });

  if(!member){
    res.status(403);
    return res.json({
      message: "Membership does not exist for this User",
      statusCode: 404
    });
  }

  if (user.id === group.organizerId || user.id === member.memberId) {
    await member.destroy();
    return res.json({
      message: "Successfully deleted membership from group",
    });
   }
   else {
    res.status(403);
    return res.json({
      message: "Only the User or organizer may delete a Membership",
      statusCode: 403
    });
   }

});

//Add an Image to a Group based on group id
router.post('/:groupId/images', requireAuth, async(req, res) => {
  const { user } = req;
  let { groupId } = req.params;
    groupId = parseInt(groupId);

  const { url } = req.body;

  const group = await Group.findByPk(groupId);

  if(!group){
    res.status(404);
    return res.json({
      message: 'Group could not be found',
      statusCode: 404
    });
  };

  if(user.id !== group.organizerId){
    res.status(403);
    return res.json({
      message: 'User not authorized',
      statusCode: 403
    });
  };

  const newImage = await Image.create({
    groupId: groupId,
    imageableType: 'Group',
    url
  });

  return res.json({
    id: newImage.id,
    imageableId: newImage.groupId,
    url: newImage.url
  })
});

//Get Details of a Group by id
router.get("/:groupId", async (req, res) => {
  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId, {
    include: [
      {
        model: Image,
        attributes: {
              include: [['groupId', 'imageableId']],
              exclude: ['eventId','groupId','createdAt', 'updatedAt', 'imageableType']
            }
      },
       {
        model: Membership,
      },
      {
        model: User,
        as: "Organizer",
        attributes: {
          exclude: ['email', 'hashedPassword', 'createdAt', 'updatedAt']
        }
      },
      {
        model: Venue,
        attributes: {
          exclude:  ['createdAt', 'updatedAt']
        }
      }
    ],
    attributes: {

      exclude: ['previewImage']
    },
  });

  if(!group) {
    let err = new Error("Group Could not be found");
    err.status = 404;
    throw err;
  };

  group.dataValues.numMembers = group.dataValues.Memberships.length;
  delete group.dataValues.Memberships;

  return res.json(group);
});

//Get all Groups
router.get("/", async (req, res) => {
    const Groups = await Group.findAll({
      include: [
        {
          model: Membership,
        }
      ],
    });

      Groups.forEach(function(group)
        {group.dataValues.numMembers = group.dataValues.Memberships.length,
        delete group.dataValues.Memberships;
        }
    );

    res.json({
      Groups
    });
  });

  //Create a new Group
router.post("/", requireAuth, validateGroup, async (req, res) => {
  const { name, about, type, city, state } = req.body;
  const { user } = req; //grab user information

  const newGroup = await Group.create({
    organizerId: user.id,
    name,
    about,
    type,
    city,
    state,
  });

   const newMembership = await Membership.create({
    memberId: user.id,
    groupId: newGroup.id,
    status: 'host'
   });

  return res.json(newGroup);
});

//Edit a Group

router.put("/:groupId", requireAuth, validateGroup, async (req, res) => {
  const { user } = req;
  let { groupId } = req.params;
  groupId = parseInt(groupId);
  const { name, about, type, city, state } = req.body;

  const group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group could not be found",
      statusCode: 404,
    });
  }

  if (user.id !== group.organizerId) {
    res.status(403);
    return res.json({
      message: "Forbidden",
      statusCode: 403,
    });
  }

  await group.update({
    name,
    about,
    type,
    city,
    state,
  });

  res.json(group);
});

//Delete a Group
router.delete("/:groupId", requireAuth, async (req, res) => {
  const { user } = req;
  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const group = await Group.findByPk(groupId);

  if (!group) {
    res.status(404);
    return res.json({
      message: "Group could not be found",
      statusCode: 404,
    });
  }

  if (user.id !== group.organizerId) {
    res.status(403);
    return res.json({
      message: "Forbidden",
      statusCode: 403,
    });
  }

  await group.destroy();

  return res.json({
    message: "Successfully Deleted",
    statusCode: 200,
  });
});


module.exports = router;
