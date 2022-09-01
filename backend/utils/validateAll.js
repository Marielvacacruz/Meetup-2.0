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
    .withMessage('Must enter a type')
    .isIn(['Online', 'In person'])
    .withMessage('Type must be Online or In person'),
  // check('private')
  //     .exists({checkFalsy: true })
  //     .withMessage('this is required')
  //     .isBoolean()
  //     .withMessage('Private must be a boolean'),
  check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
  check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
  handleValidationErrors
];

//Validate Venue
const validateVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check("lat")
    .isDecimal({ min: -90.0, max: 90.0 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .isDecimal({ min: -180.0, max: 180.0 })
    .withMessage("Longitude is not valid"),
  handleValidationErrors
];


//Validate Events
const validateEvent = [
  check('venueId')
   .exists()
   .withMessage('Venue does not exist'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isLength({ min: 5 })
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .exists({ checkFalsy: true })
    .withMessage('Must enter a type')
    .isIn(['Online', 'In person'])
    .withMessage('Type must be Online or In person'),
  check('capacity')
      .exists({checkFalsy: true })
      .withMessage('Must enter Capacity')
      .isInt()
      .withMessage('Capacity must be an Integer'),
  check('price')
      .exists()
      .withMessage('Must enter price')
      .isDecimal()
      .withMessage('Price is Invalid'),
  check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
  check('startDate')
      .exists({ checkFalsy: true })
      .withMessage('Start date is required')
      .isAfter()
      .withMessage('Start date must be in the future'),
  check('endDate')
      .exists({ checkFalsy: true })
      .withMessage('End date is required'),
  check('endDate').custom((endDatStr, { req }) => {
    const endDate = new Date(endDatStr);
    const startDate = new Date(req.body.startDate);
    if(endDate < startDate){
      return Promise.reject("End date is less than start date")
    }else return true;
  }),
  handleValidationErrors
];

//validate Query Parameters

const validateQueryParams = [
  check("page")
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage("Page must be greater than or equal to 0"),
  check("size")
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage("Size must be greater than or equal to 0"),
  check("name")
    .optional({ nullable: true })
    .isString()
    .withMessage("Name must be a string"),
  check("type")
    .optional({ nullable: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("startDate")
    .optional({ nullable: true })
    .isDate()
    .withMessage("Start date must be a valid datetime"),
  handleValidationErrors,
];
    module.exports = { validateSignup, validateLogin, validateGroup, validateVenue, validateEvent, validateQueryParams }
