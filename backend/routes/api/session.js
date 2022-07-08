const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//validate login
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email is required.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required.'),
    handleValidationErrors
];

//Log in
router.post('/', validateLogin, async (req, res,  next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password});

    if (!user) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        err.title = 'Login Failed';
        err.errors = ['The provided credentials were invalid. '];
        return next(err);
    }

    await setTokenCookie(res, user);
    const { token } = req.cookies;

    return res.json({
        ...user.toSafeObject(),
        token
    });
});

//Log out

router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});


module.exports = router;
