const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users');

router.use('/session', sessionRouter);
router.use('/users', usersRouter);

//test route
router.post('/test', function(req, res) {
    res.json({requestBody: req.body});
});

module.exports = router;
