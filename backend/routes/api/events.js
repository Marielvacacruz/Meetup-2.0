const express = require('express');
const { requireAuth, restoreUser } = require('../../utils/auth');
const {validateEvent, validateQueryParams} = require('../../utils/validateAll');
const { Event, Group, Membership, Image, Attendance, Venue, User} = require('../../db/models');


const router = express.Router();

//Get All Attendees of an Event specified by its id
router.get('/:eventId/attendance', restoreUser, async(req, res) => {
    const { user } = req;
    let { eventId } = req.params;
        eventId = parseInt(eventId);

        const event = await Event.findByPk(eventId);

        if(!event){
            res.status(404);
            return res.json({
                message: 'Event Could Not Be Found',
                statusCode: 404
            });
        };

        const membership = await Membership.findOne({
            where: {
              memberId: user.id,
              groupId: event.groupId,
              status: ["host", "co-host"]
            }
          });

        if(membership){
             const Attendees = await Event.findByPk(eventId,{
                include:
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'firstName' ],
                        through: {attributes: ['status']}
                    },
                attributes: []

            });

            return res.json({Attendees: Attendees.Users });
         } else {
                      const Attendees = await Attendance.findAll({
                        where: {
                          eventId: event.id,
                          status: ["member", "waitlist", "attending"]
                        }
                      });
                      res.json({ Attendees: Attendees });
                    }

});


//Request to Attend and Event based on Event's id
router.post('/:eventId/attendance', requireAuth, async(req,  res) => {
    const { user } = req;

    let { eventId } = req.params;
        eventId = parseInt(eventId);

        const event = await Event.findByPk(eventId);

        if(!event){
            res.status(404);
            return res.json({
                message: 'Event Could Not Be Found',
                statusCode: 404
            });
        };

        const member = await Membership.findOne(
            {
                where: { memberId: user.id, groupId: event.groupId }
            }
        );

        if(!member){
            res.status(403);
            return res.json({
              message: "Forbidden",
              statusCode: 403,
            });
        };

        const attendee = await Attendance.findOne(
            {
                where: { eventId, userId: user.id }
            }
        );

        if(attendee){
            if(attendee.status  === 'pending'){
                res.status(400);
                return res.json({
                    message: 'Attendance has already been requested',
                    statusCode: 400
                });
            };

            if(attendee.status === 'attending'){
                res.status(400);
                return res.json({
                     message: "User is already an attendee of the event",
                    statusCode: 400
                });
            };
        };

        if(member){
            const attendance = await Attendance.create({
                eventId: event.id,
                userId: user.id,
                status: 'pending'
            });
            return res.json({
                eventId: attendance.id,
                userId: attendance.userId,
                status: attendance.status
            });
        }


});

//Change status of an ATTENDANCE to an event by its id
router.put('/:eventId/attendance', requireAuth, async(req, res) =>{
    const { user } = req;
  const { eventId } = req.params;
  const { userId, status } = req.body;

  const event = await Event.findByPk(eventId);

  if (!event) {
    res.status(404);
    return res.json({
        message: 'Event Could Not Be Found',
        statusCode: 404
    });
  }

  const membership = await Membership.findOne({
    where: {
      memberId: user.id,
      groupId: event.groupId,
      status: ["host", "co-host"]
    }
  });

  if (!membership) {
    res.status(403);
            return res.json({
              message: "Forbidden",
              statusCode: 403,
            });
  }else{

    const attendance = await Attendance.findOne({ where: { userId, eventId } });

    if (!attendance) {
        res.status(404);
        return res.json({
            message: "Attendance between the user and the event does not exist",
            statusCode: 404
        });
    }

    if (status === "pending") {
      res.status(400);
      return res.json({
        message: "Cannot change an attendance status to pending",
        statusCode: 400
      });
    }

    await attendance.update({
      status
    });

    return res.json({
        id: attendance.id,
        userId: attendance.userId,
        eventId: attendance.eventId,
        status: attendance.status
    });

  }
});

//Add an Image to an Event based on event id (THIS ROUTE NEEDS WORK, NOT CHECKING ATTENDEE)
router.post('/:eventId/images', requireAuth, async(req, res) => {
    const { user } = req;
    let { eventId } = req.params;
      eventId = parseInt(eventId);

    const { url } = req.body;

    const event = await Event.findByPk(eventId);

    if(!event){
      res.status(404);
      return res.json({
        message: 'Event could not be found',
        statusCode: 404
      });
    };

    const attendee = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId
          }
    });

    if(!attendee){
      res.status(403);
      return res.json({
        message: 'User not authorized',
        statusCode: 403
      });
    };

      const newImage = await Image.create({
          eventId: eventId,
          imageableType: 'Event',
          url
        });

        return res.json({
          id: newImage.id,
          imageableId: newImage.eventId,
          url: newImage.url
        });
  });



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
router.get('/', validateQueryParams, async(req, res) => {
    let {page, size, name, type, startDate } = req.query;

    // if (page) page = parseInt(page);
    // if (size) size = parseInt(size);

    let where = {};
    let pagination = {};

    if (!page) page = 0;
    if (!size) size = 20;

    if (Number.isNaN(page) || page < 0 || page > 10) {
        page = 0;
      } else {
        page = page;
      }

      if (Number.isNaN(size) || size < 0 || size > 20) {
        size = 20;
      } else {
        size = size;
      }

      if (page > 0) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
      } else {
        pagination.limit = size;
      }

      if (name) {
        where.name = name;
      }

      if (startDate) {
        const date = new Date(startDate);
        const lastDate = date.setDate(date.getDate() + 1);
        where.startDate = { [Op.between]: [startDate, lastDate] };
      }

      if (type === "Online" || type === "In person") {
        where.type = type;
      }

    const Events = await Event.findAll({
        include: [
            {
                model: Attendance,
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
        attributes:
            {
                exclude: ['price', 'description', 'capacity', 'endDate']
            } ,
         where: { ...where },
        ...pagination,

    });

    Events.forEach(function(event)
       {event.dataValues.numAttending = event.dataValues.Attendances.length,
        delete event.dataValues.Attendances;
        }
    );

    return res.json({
        Events
    });
});

//Delete ATTENDANCE by its id
router.delete('/:eventId/attendance', requireAuth, async(req, res) => {
    const { user } = req;
    const  { userId } = req.body;


    let { eventId } = req.params;
        eventId = parseInt(eventId);


    const event = await Event.findByPk(eventId, {
        include: [
            {
                model: Group
            }
        ]
    });

    if(!event){
        res.status(404);
        return res.json({
            message: 'Event Could Not Be Found',
            statusCode: 404
        });
    };

    const attendance = await Attendance.findOne({
        where: {
            userId,
            eventId
        }
    });

    if(!attendance){
        res.status(404);
        return res.json({
            message: "Attendance does not exist for this User",
            statusCode: 404
        });
    };

    if(user.id === event.Group.organizerId || attendance.userId === user.id){
        await attendance.destroy()
        return res.json({
            message: 'Successfully deleted attendance from event'
        });
     } else {
            res.status(403);
            return res.json({
                message: "Only the User or organizer may delete an Attendance",
                statusCode: 403
            });
     }

});

//Delete an Event specified by it's id
router.delete('/:eventId',requireAuth, async(req, res) => {
    const { user } = req;
    const { eventId } = req.params;

    const  event = await Event.findByPk(eventId);

    if(!event){
        res.status(404);
            return res.json({
            message: 'Event could not be found',
            statusCode: 404
            });
    };

   const group = await Group.findByPk(event.groupId);

   const status = await Membership.findOne({
    where: { memberId: user.id, groupId: group.id },
  });

   if(user.id === group.organizerId || status.status === 'co-host'){
       await event.destroy();
       return res.json({
           message: 'Successfully deleted'
       });
   }else{
       res.status(403);
       return res.json({
           message: 'Forbidden',
           statusCode: 403
       })
   }

});



module.exports = router;
