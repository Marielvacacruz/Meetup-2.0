const router = require('express').Router();
const sessionRouter = require('../api/session');
const usersRouter = require('../api/users');
const groupsRouter = require('../api/groups');
const eventRouter = require('../api/events');
const venueRouter = require('../api/venues');
//const imagesRouter = require('../api/images');


router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/groups', groupsRouter);
router.use('/events', eventRouter);
router.use('/venues', venueRouter);
//router.use('/images', imagesRouter);


//test route
router.post('/test', function(req, res) {
    res.json({requestBody: req.body});
});

module.exports = router;
