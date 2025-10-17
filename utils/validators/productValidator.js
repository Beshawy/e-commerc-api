const {check} = require('express-validator') ;
const validationMiddleware = require('../../middlewares/validationMiddleware') ;

exports.createProductValidator = [
    check('title')
    .isLength({min : 3})
    .withMessage('Too short product title')
    .isLength({max : 100})
    .withMessage('Too long product title')
    .notEmpty()
    .withMessage('Product title is required'),
    check('description')
    .isLength({max : 2000})
    .withMessage('Too long product description')
    .notEmpty()
    .withMessage('Product description is required'),
    check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number'),
    check('sold')
    .optional()
    .isNumeric()
    .withMessage('Product sold must be a number'),
    check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number')
    .isLength({max : 32})
    .withMessage('Too long product price'),
    check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Product priceAfterDiscount must be a number')
    .toFloat()
    .custom((value , {req}) =>{
        if(req.body.price <= value){
            throw new Error('priceAfterDiscount must be lower than price') ;
        }
        return true ;
    }) ,
    check('colors')
    .optional()
    .isArray()
    .withMessage('Available colors should be an array of strings'),
    check('imageCover').notEmpty().withMessage('Product image cover is required'),
    check('images')
    .optional()
    .isArray()
    .withMessage('Product images should be an array of strings'),
    check('category')
    .notEmpty()
    .withMessage('Product must belong to a category')
    .isMongoId().withMessage('Invalid category id'),
    check('subCategories')
    .optional()
    .isMongoId()
    .withMessage('Invalid subCategory id'),
    check('brand')
    .optional()
    .isMongoId()
    .withMessage('Invalid brand id'),
    check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('Ratings Average must be a number')
    .isLength({min : 1})
    .withMessage('Rating must be above or equal 1.0')
    .isLength({max : 5})
    .withMessage('Rating must be below or equal 5.0'),
    check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('Ratings Quantity must be a number'),
    validationMiddleware ,
  ] ;

exports.getProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id') ,
    validationMiddleware,
]  ;

exports.updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id') ,
    validationMiddleware,
] ;

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id') ,
    validationMiddleware,
]


