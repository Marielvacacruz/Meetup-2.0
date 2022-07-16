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


module.exports = router;
