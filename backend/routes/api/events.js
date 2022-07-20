const express = require('express');
const { requireAuth, restoreUser } = require('../../utils/auth');
const {validateEvent} = require('../../utils/validateAll');
const { Event, Group, Membership, Image, Attendance, Venue, User, sequelize} = require('../../db/models');


const router = express.Router();

//Edit an Event specified by its id
router.put('/:eventId', requireAuth, validateEvent, async(req, res) => {
    const { user } = req;

    let { eventId } = req.params;
        eventId = parseInt(eventId);

        const {
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        } = req.body;

     if(venueId !== null){
            const venue = await Venue.findByPk(venueId);
        if(!venue){
            res.status(404);
            return res.json({
                message: 'Venue could not be found',
                statusCode: 404
            });
        };
    }


        const event = await Event.findByPk(eventId, {
            include: [
                {
                    model: Group,
                    include: [
                        {
                            model: Membership,
                            where: {
                                memberId: user.id
                            }
                        }
                    ]
                }
            ]
        });

        if(!event){
            res.status(404);
            return res.json({
                message: 'Event could not be found',
                statusCode: 404
            });
        };

        if(user.id === event.Group.organizerId || (event.Group.Memberships.length && event.Group.Memberships[0].status === 'co-host')){
          await event.update({
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
            });
            return res.json(
                event
            );
        }else {
            res.status(403);
            return res.json({
              message: "Forbidden",
              statusCode: 403,
            });
          }
});

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
