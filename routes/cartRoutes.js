const express = require('express') ;
const { addProductToCart,
     getCart ,
     updateCart ,
     deleteProductFromCart
     } = require('../services/cartService') ;
const { addProductToCartValidator ,
     updateCartValidator ,
      deleteProductFromCartValidator } = require('../utils/validators/cartValidator') ;
const authService = require('../services/authService') ;


const router = express.Router() ;

// تطبيق middleware المصادقة على جميع routes السلة
router.use(authService.protect) ;

router.route('/')
    .get(getCart)
    .post(addProductToCartValidator , addProductToCart) 
    .put(updateCartValidator , updateCart) ;

router.route('/:productId')
    .delete(deleteProductFromCartValidator , deleteProductFromCart) ;



module.exports = router ;