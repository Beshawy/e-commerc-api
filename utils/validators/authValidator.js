const { check } = require('express-validator');
const validationMiddleware = require('../../middlewares/validationMiddleware');
const User = require('../../models/userModel');

// signup validator (مثال موجز)
exports.signUpValidator = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email')
    .isEmail().withMessage('Invalid email')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) throw new Error('E-mail already in use');
      return true;
    }),
  check('password').isLength({ min: 6 }).withMessage('Password too short'),
  check('passwordConfirm')
    .custom((val, { req }) => val === req.body.password)
    .withMessage('Password confirmation does not match password'),
  validationMiddleware,
];

// login validator — فقط التحقق من وجود اليوزر وكلمة المرور (بدون passwordConfirm)
exports.loginValidator = [
  check('email')
    .isEmail().withMessage('Invalid email address')
    .notEmpty().withMessage('User email is required')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (!user) {
        return Promise.reject(new Error('No user with this email'));
      }
      return true;
    }),
  check('password')
    .notEmpty().withMessage('User password is required'),
  validationMiddleware,
];



