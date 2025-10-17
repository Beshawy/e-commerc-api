const {param, check} = require('express-validator') ;
const validationMiddleware = require('../../middlewares/validationMiddleware') ;

exports.getBrandValidator = [
  param('id').isMongoId().withMessage('Invalid Brand id') ,
    validationMiddleware , 
] ;

exports.createBrandValidator = [
    check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({min : 3})
    .withMessage('Brand name must be at least 3 characters')
    .isLength({max : 32})
    .withMessage('Brand name is too large'),
    validationMiddleware ,
  ] ;

  exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id') ,
    validationMiddleware,
  ] ;


    exports.deleteBrandValidator = [
         check('id').isMongoId().withMessage('Invalid Brand id') ,
          validationMiddleware,
    ]

