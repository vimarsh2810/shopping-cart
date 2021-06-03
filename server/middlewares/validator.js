const { body, validationResult } = require('express-validator');
const { responseObj } = require('../helpers/responseObj');

const signupValidator = () => {
  return [
    body('name')
      .matches(/^[a-zA-Z][a-z\s]+$/i)
      .withMessage('Name must only contain alphabets & spaces.'),
    
    body('username')
      .isAlphanumeric().withMessage('Username must only contain alphanumeric characters')
      .isLength({ min: 6, max: 20 }).withMessage('Username length must be between 6 to 20'),

    body('email')
      .isEmail().withMessage('Email is invalid'),

    body('password')
      .isLength({ min: 5, max: 16 }).withMessage('Password length must be between 5 to 16'),
    
    body('confirmPassword')
      .custom((value, {req}) => {
        if(value !== req.body.password) {
          throw new Error('Both password do not match');
        }
        return true;
      })
  ]
};

const loginValidator = () => {
  return [
    body('email')
      .isEmail().withMessage('Email is invalid'),

    body('password')
      .not()
      .isEmpty().withMessage('Please enter password')
  ]
};

const editProfileValidator = () => {
  return [
    body('name')
      .matches(/^[a-zA-Z][a-z\s]+$/i)
      .withMessage('Name must only contain alphabets & spaces.'),
    
    body('username')
      .isAlphanumeric().withMessage('Username must only contain alphanumeric characters')
      .isLength({ min: 6, max: 20 }).withMessage('Username length must be between 6 to 20'),

    body('email')
      .isEmail().withMessage('Email is invalid'),
  ]
}

const categoryValidator = () => {
  return [
    body('title')
      .not()
      .isEmpty().withMessage('Title can not be empty')
      .isLength({ min: 2, max: 40}).withMessage('Category title must contain 2 to 40 characters')
  ]
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    return next();
  }
  const errorMsgs = [];
  errors.array().forEach(err => {
    errorMsgs.push(err.msg);
  });
  return res.status(400).json(responseObj(false, 'Validation Errors', errorMsgs));
};

module.exports = { 
  signupValidator,
  loginValidator,
  editProfileValidator,
  categoryValidator, 
  validate 
};