const { validationResult } = require('express-validator');

//middleware for formatting errors from express-validator

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        const errors = validationErrors
            .array()
            .map((error) => `${error.msg}`);

        const err = Error('Validation Error');
        err.errors = errors;
        err.status = 400;
        err.title = 'Validation Error';
        next(err);
    }
    next();
};

module.exports = { handleValidationErrors };
