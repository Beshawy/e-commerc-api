const {check} = require('express-validator') ;
const validationMiddleware = require('../../middlewares/validationMiddleware') ;


exports.addProductToCartValidator = [
    check('productId')
    .notEmpty()
    .withMessage('Product id is required')
    .isMongoId()
    .withMessage('Invalid product id') ,
    check('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1') ,
    check('color')
    .optional()
    .isString()
    .withMessage('Color must be a string') ,
    validationMiddleware ,
] ;


exports.updateCartValidator = [
    check('productId')
    .notEmpty()
    .withMessage('Product id is required')
    .isMongoId()
    .withMessage('Invalid product id') ,
    check('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1') ,
    check('color')
    .optional()
    .isString()
    .withMessage('Color must be a string') ,
    validationMiddleware ,
] ;


exports.deleteProductFromCartValidator = [
    check('productId')
    .notEmpty()
    .withMessage('Product id is required')
    .isMongoId()
    .withMessage('Invalid product id') ,
    validationMiddleware ,
] ;
