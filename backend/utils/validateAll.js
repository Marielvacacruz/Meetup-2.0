const { check } = require('express-validator');
const { handleValidationErrors } = require('./validation');

//middleware to validate sign up
const validateSignup = [
    check("firstName")
      .exists({ checkFalsy: true })
      .withMessage("First Name is required"),
    check("lastName")
      .exists({ checkFalsy: true })
      .withMessage("Last Name is required"),
      check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
      check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
      handleValidationErrors
    ];

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

    module.exports = { validateSignup, validateLogin }
