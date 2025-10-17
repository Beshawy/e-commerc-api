const {param, check , body} = require('express-validator') ;
const validationMiddleware = require('../../middlewares/validationMiddleware') ;
const User = require('../../models/userModel') ;


exports.getUserValidator = [
  param('id').isMongoId().withMessage('Invalid User id') ,
    validationMiddleware , 
] ;

exports.createUserValidator = [
    check('name')
    .notEmpty()
    .withMessage('User name is required')
    .isLength({min : 3})
    .withMessage('User name must be at least 3 characters'),
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
    check('phone')
    .optional() 
    .isMobilePhone(['ar-EG'])
    .withMessage('Invalid phone number') ,
    check('profileImg')
    .optional()
    .isString()
    .withMessage('Invalid image format') ,
    check('role')
    .optional()
    .isIn(['user' , 'admin' , 'super-admin'])
    .withMessage('Role must be user , admin or super-admin') ,
    validationMiddleware ,
  ] ;

  exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id') ,
    body('name')
    .optional()
    .custom((val) =>{
      if(val.length < 3) {
        throw new Error('User name must be at least 3 characters') ;
      }
    }) ,
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
    body('phone')
    .optional() ,
    validationMiddleware,
  ] ;


    exports.deleteUserValidator = [
         check('id').isMongoId().withMessage('Invalid User id') ,
          validationMiddleware,
    ]

    exports.changeUserPasswordValidator = [
      body('currentPassword')
       .notEmpty()
       .withMessage('Current password is required'),
      body('password')
        .notEmpty()
        .withMessage('User password is required'),
      body('passwordConfirm')
        .notEmpty()
        .withMessage('User password confirmation is required')
        .custom(async (val , {req}) => {
            const user = await User.findById(req.params.id) ;
            if(!user){
              throw new Error('There is no user for this id') ;
            }
            const isCorrectPassword =  bcrypt.compare(req.body.currentPassword , user.password)
            if(!isCorrectPassword) {
              throw new Error('Current password is incorrect') ;
            }

            if(val !== req.body.password) {
              throw new Error('Password confirmation does not match password') ;
            }
          })
         ,
        validationMiddleware ,
    ]

