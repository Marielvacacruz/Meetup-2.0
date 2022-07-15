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

  // const image = await Image.findAll({
  //   where: {
  //   imageableId: groupId,
  //   imageableType: 'Group'
  //   },
  //   attributes: {
  //     exclude: ['createdAt', 'updatedAt', 'imageableType']
  //   }
  // });

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


module.exports = router;
