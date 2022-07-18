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
  sequelize,
  Event,
  Attendance,
  Venue,
} = require("../../db/models");
const { Op } = require('sequelize');
const group = require("../../db/models/group");

const router = express.Router();

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

    // const member = await Member.findOne({
    //   where: {
    //     userId: user.id,
    //     groupId,
    //   },
    //   attributes: [
    //     ["groupId", "groupId"],
    //     ["userId", "memberId"],
    //     ["status", "status"],
    //   ],
    // });
    return res.json(
      reqMembership,
    );
  }
});


//Get Details of a Group by id
router.get("/:groupId", async (req, res) => {
  let { groupId } = req.params;
  groupId = parseInt(groupId);

  const Groups = await Group.findByPk(groupId, {
    include: [
      {
        model: Image,
        where: {
          groupId: groupId,
          imageableType: 'Group'
        },
        attributes: {
              include: [['groupId', 'imageableId']],
              exclude: ['groupId','createdAt', 'updatedAt', 'imageableType']
            }
      },
      {
        model: Membership,
        attributes: [],
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
      include: [
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"],
      ],
      exclude: ['previewImage']
    },
  });

  if (Groups.id === null) {
    let err = new Error("Group Could not be found");
    err.status = 404;
    throw err;
  }

  res.json(Groups);
});

//Get all Groups
router.get("/", async (req, res) => {
    const Groups = await Group.findAll({
      include: [
        {
          model: Membership,
          attributes: [],
        }
      ],
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]
        ],
      },
      group: ["Group.id"],
    });
    res.json({
      Groups
    });
  });

  //Create a new Group
router.post("/", requireAuth, validateGroup, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const { user } = req; //grab user information

  const newGroup = await Group.create({
    organizerId: user.id,
    name,
    about,
    type,
    private,
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
  const { name, about, type, private, city, state } = req.body;

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
    private,
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
