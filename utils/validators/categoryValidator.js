const {param, check} = require('express-validator') ;
const validationMiddleware = require('../../middlewares/validationMiddleware') ;

exports.getCategoryValidator = [
  param('id').isMongoId().withMessage('Invalid Castegory id') ,
    validationMiddleware , 
] ;

exports.createCategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({min : 3})
    .withMessage('Category name must be at least 3 characters')
    .isLength({max : 32})
    .withMessage('Category name is too large'),
    validationMiddleware ,
  ] ;

  exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Castegory id') ,
    validationMiddleware,
  ] ;


    exports.deleteCategoryValidator = [
         check('id').isMongoId().withMessage('Invalid Castegory id') ,
          validationMiddleware,
    ]

