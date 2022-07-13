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

const router = express.Router();




//Get all Groups
router.get("/", async (req, res) => {
    const previewImage = await Image.findAll({
        where: {
            imageableType: 'Group'
        }
    });

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
      Groups, previewImage
    });
  });
module.exports = router;
