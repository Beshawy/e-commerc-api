const express = require('express');
const { getProducts , getProduct , creatProduct , updateProduct , deleteProduct } = require('../services/productService');
const router = express.Router(); 
const { getProductValidator , createProductValidator , updateProductValidator , deleteProductValidator } = require('../utils/validators/productValidator');


router.route('/')
.get(getProducts)
.post( createProductValidator ,creatProduct) ;

router
.route('/:id')
.get(getProductValidator , getProduct)
.put(updateProductValidator , updateProduct)
.delete(deleteProductValidator , deleteProduct) ; 

module.exports = router ;
