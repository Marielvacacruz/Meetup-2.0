const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { validateLogin } = require('../../utils/validateAll');

const router = express.Router();


//Log in
router.post('/', validateLogin, async (req, res,  next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password});

    if (!user) {
        let err = new Error('Invalid credentials');
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
