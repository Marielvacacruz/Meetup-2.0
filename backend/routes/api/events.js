const express = require('express');
const { requireAuth, restoreUser } = require('../../utils/auth');
const {validateEvent} = require('../../utils/validateAll');
const { Event, Group, Member, Image, Attendance, Venue, User, sequelize} = require('../../db/models');


const router = express.Router();

// //Get all events
router.get('/', async(req, res) => {

    const Events = await Event.findAll({
        include: [
            {
                model: Attendance,
                attributes: []
            },
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            }
        ],
        attributes:[
            'id',
            'venueId',
            'groupId',
            'name',
            'type',
            'startDate',
            'previewImage',
             [sequelize.fn("COUNT", sequelize.col("Attendances.id")), "numAttending"],

            ],
        group: ['Event.id']
    });

    return res.json({
        Events
    });
});



module.exports = router;
