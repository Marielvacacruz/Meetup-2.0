const express = require("express");
const router = express.Router();
const {
  Membership,
  Venue,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { validateVenue } = require("../../utils/validateAll");

//Edit a venue specified by ID
router.put("/:venueId", requireAuth, validateVenue, async (req, res, next) => {
    const { user } = req;
    const { venueId } = req.params;
    const { address, city, state, lat, lng } = req.body;

    const venue = await Venue.findByPk(venueId);

    if (!venue) {
        res.status(404);
        return res.json({
            message: "Venue couldn't be found",
            statusCode: 404
        });
    };

    const group = venue.groupId;

    const owner = await Membership.findOne({
      where: {
        memberId: user.id,
        groupId: group
      }
    });

    if (!owner) {
      const err = new Error("Membership not found");
      err.message = "Membership not found";
      err.status = 404;
      return next(err);
    }

    if (owner.status === "host" || owner.status === "co-host") {
      const updateVenue = await venue.update({
        address,
        city,
        state,
        lat,
        lng
      });

      const updatedVenue = await Venue.findOne({
        where: {id: venue.id },
        attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"]
      });

      console.log(updateVenue)
      res.json(updatedVenue);
    }
    else {
        res.status(403);
        return res.json({
            message: "Forbidden",
            statusCode: 403
        });
    }
  });

//Delete a Venue
router.delete("/:venueId", requireAuth, async (req, res) => {
    const { user } = req;
    const { venueId } = req.params;

    const venue = await Venue.findByPk(venueId);

    if (!venue) {
        res.status(404);
        return res.json({
            message: "Venue couldn't be found",
            statusCode: 404
        });
    };

    const group = venue.groupId;

    const owner = await Membership.findOne({
        where: {
          memberId: user.id,
          groupId: group
        }
      });

      if (!owner) {
        const err = new Error("Membership not found");
        err.message = "Membership not found";
        err.status = 404;
        return next(err);
      }

      if (owner.status === "host" || owner.status === "co-host") {
        await venue.destroy();
        return res.json({
            message: "Successfully Deleted Venue",
            statusCode: 200,
          });

      }
      else {
          res.status(403);
          return res.json({
              message: "Forbidden",
              statusCode: 403
          });
      }

});


module.exports = router;
