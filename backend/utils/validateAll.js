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

//middleware to validate new Group
const validateGroup = [
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isLength({ max: 60 })
    .withMessage('Name must be 60 characters or less.'),
  check('about')
    .exists({ checkFalsy: true })
    .withMessage('About is required')
    .isLength({ min: 50 })
    .withMessage('About must be 50 characters or more'),
  check('type')
    .exists({ checkFalsy: true })
    .withMessage('Must choose a type')
    .isIn(['Online', 'In person'])
    .withMessage('Type must be Online or In person'),
  check('private')
      .exists({checkFalsy: true })
      .withMessage('this is required')
      .isBoolean()
      .withMessage('Private must be a boolean'),
  check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
  check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
  handleValidationErrors
];

    module.exports = { validateSignup, validateLogin, validateGroup }
