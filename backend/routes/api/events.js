const express = require('express');
const { requireAuth, restoreUser } = require('../../utils/auth');
const {validateEvent} = require('../../utils/validateAll');
const { Event, Group, Member, Image, Attendance, Venue, User, sequelize} = require('../../db/models');


const router = express.Router();

//Get details of event by it's id
router.get('/:eventId', async(req, res) => {
    let { eventId } = req.params;
        eventId = parseInt(eventId);


        const event = await Event.findByPk(eventId, {
            include: [
                {
                    model: Image,
                    attributes: {
                          include: [['eventId', 'imageableId']],
                          exclude: ['eventId','groupId','createdAt', 'updatedAt', 'imageableType']
                        }
                  },
                {
                    model: Attendance,
                },
                {
                    model: Group,
                    attributes: ['id', 'name', 'private', 'city', 'state']
                },
                {
                    model: Venue,
                    attributes: ['id','address', 'city', 'state', 'lat', 'lng']
                },
            ],
            attributes: {
                exclude: ['previewImage','createdAt', 'updatedAt']
            },
        });

        if(!event){
            res.status(404);
            return res.json({
            message: 'Event could not be found',
            statusCode: 404
            });
        };

        event.dataValues.numAttending = event.dataValues.Attendances.length;
        delete event.dataValues.Attendances;



    return res.json(
        event
    )

});


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
