const {param, check , body} = require('express-validator') ;
const validationMiddleware = require('../../middlewares/validationMiddleware') ;
const User = require('../../models/userModel') ;


exports.signUpValidator = [
    check('name')
    .notEmpty()
    .withMessage('User name is required')
    .isLength({min : 3})
    .withMessage('User name must be at least 3 characters')
    .custom((val) => {
      return User.findOne({name : val}).then((user) => {
        if(user) {
          return Promise.reject(new Error('Username already in use')) ;
        } ;
      }) ;
    }),
    check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) => User.findOne({email : val}).then((user) => {
      if(user) {
        return Promise.reject(new Error('E-mail already in use')) ;
      }
    }))
    .notEmpty()
    .withMessage('User email is required'),
    check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isLength({min : 6})
    .withMessage('User password must be at least 6 characters'),
    check('passwordConfirm')
    .notEmpty()
    .withMessage('User password confirmation is required')
    .custom((val , {req}) => {
      if(val !== req.body.password) {
        throw new Error('Password confirmation does not match password') ;
      }
      return true ;
    }) ,
    validationMiddleware ,
  ] ;


  exports.loginValidator = [
    check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .notEmpty()
    .withMessage('User email is required')
    .custom(async(val) =>{
      const user = await User.findOne({email : val}) ;
      if(!user){
        return Promise.reject(new Error('No user with this email')) ;
      }
      return true
    }),
    check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isLength({min : 6})
    .withMessage('User password must be at least 6 characters')
    .custom((val , {req}) =>{
      if(val !== req.body.passwordConfirm) {
        throw new Error('Password confirmation does not match password') ;
      }
      return true ;
    }) ,
    validationMiddleware ,
  ] ;



