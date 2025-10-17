const {param,check} = require('express-validator') ;
const validationMiddleware = require('../../middlewares/validationMiddleware') ;

exports.getSubCategoryValidator = [
  param('id').isMongoId().withMessage('Invalid SubCategory id') ,
    validationMiddleware , 
] ;

exports.createSubCategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage('SubCategory name is required')
    .isLength({min : 2})
    .withMessage('SubCategory name must be at least 2 characters')
    .isLength({max : 32})
    .withMessage('SubCategory name is too large'),
    check('category').notEmpty().withMessage('SubCategory must be belong to a category')
    .isMongoId().withMessage('Invalid SubCategory id') ,
    validationMiddleware ,
  ] ;

  exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCastegory id') ,
    validationMiddleware,
  ] ;


    exports.deleteSubCategoryValidator = [
         check('id').isMongoId().withMessage('Invalid SubCastegory id') ,
          validationMiddleware,
    ]

