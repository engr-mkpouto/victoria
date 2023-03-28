const { check } = require('express-validator');

exports.validRegister = [
    check('username', 'Username is required').notEmpty()
    .isLength({
        min: 6,
        max: 16
    }).withMessage('Username must be between 6 to 16 characters'),
    check('email', 'Email is required').notEmpty(),
    check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
    check('password', 'password is required').notEmpty(),
    check('password').isLength({
        min: 6,
        max: 224
    }).withMessage('Password must contain at least 6 characters').matches(/\d/).withMessage('password must contain a number'),
    check('passwordRe-enter', 'Must confirm your password').notEmpty(),
    check('passwordRe-enter').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
    })
];

exports.validStudent = [
    check('fname', 'First name is required').notEmpty()
    .isLength({
        min: 3,
        max: 16
    }).withMessage('First name must be upto 3 characters'),
    check('lname', 'Last name is required').notEmpty()
    .isLength({
        min: 3,
        max: 16
    }).withMessage('Last name must be upto 3 characters'),
    check('email', 'Email is required').notEmpty()
    .isEmail().withMessage('Must be a valid email address')
];

exports.forgotPasswordValidator = [
    check('email', 'Email is required').notEmpty(),
    check('email').isEmail().withMessage('Must be a valid email address')
];

exports.resetPasswordValidator = [
    check('newPassword', 'password is required').notEmpty(),
    check('newPassword').isString().isLength({ min: 6, max:224 }).withMessage('Password must contain at least 6 characters').matches(/\d/).withMessage('password must contain a number'),
    check('newPassword').isStrongPassword().withMessage('Password must contain Upper and lower case, atleast a number and atleast one symbol'),
    check('passwordRe-enter', 'Must confirm your password').notEmpty(),
    check('passwordRe-enter').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match password');
        } else {
            return true;
        }
    })
];