const cartModel = require('../models/cartSchema') ;
const asyncHandler = require('express-async-handler') ;
const mongoose = require('mongoose') ;
const ApiError = require('../utils/apiError') ;
const productModel = require('../models/productModel') ;
const userModel = require('../models/userModel') ;

exports.addProductToCart = asyncHandler(async (req,res,next) =>{
    const {productId, quantity, color} = req.body ;
    const userId = req.user._id ; // استخراج user ID من JWT token
    
    // التحقق من وجود المنتج
    const product = await productModel.findById(productId) ;
    if(!product){
        return next(new ApiError('Product not found', 404)) ;
    }
    
    // البحث عن سلة المستخدم أو إنشاء سلة جديدة
    let cart = await cartModel.findOne({ user: userId }) ;
    
    if (!cart) {
        // إنشاء سلة جديدة للمستخدم
        cart = await cartModel.create({
            user: userId,
            products: []
        }) ;
    }
    
    // التحقق من وجود المنتج في السلة
    const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === productId
    ) ;
    
    if (existingProductIndex > -1) {
        // تحديث كمية المنتج الموجود
        cart.products[existingProductIndex].quantity += quantity ;
        cart.products[existingProductIndex].totalPrice = product.price * cart.products[existingProductIndex].quantity ;
        cart.products[existingProductIndex].totalPriceAfterDiscount = product.priceAfterDiscount ? product.priceAfterDiscount * cart.products[existingProductIndex].quantity : product.price * cart.products[existingProductIndex].quantity ;
    } else {
        // إضافة منتج جديد للسلة
        cart.products.push({
            product: productId,
            quantity: quantity,
            price: product.price,
            totalPrice: product.price * quantity,
            totalPriceAfterDiscount: product.priceAfterDiscount ? product.priceAfterDiscount * quantity : product.price * quantity,
            color: color || undefined
        }) ;
    }
    
    // حفظ السلة
    await cart.save() ;
    
    res.status(201).json({
        status: 'success',
        data: cart
    }) ;
}) ;


exports.getCart = asyncHandler(async (req,res,next) =>{
    const userId = req.user._id ;
    
    const cart = await cartModel.findOne({ user: userId })
        .populate({
            path: 'products.product',
            select: 'title price priceAfterDiscount imageCover'
        }) ;
    
    if(!cart){
        return res.status(200).json({
            status: 'success',
            message: 'Cart is empty',
            data: {
                products: [],
                totalCartPrice: 0,
                totalCartPriceAfterDiscount: 0
            }
        }) ;
    }
    
    // حساب السعر الإجمالي للسلة
    let totalCartPrice = 0;
    let totalCartPriceAfterDiscount = 0;
    
    cart.products.forEach(item => {
        totalCartPrice += item.totalPrice;
        totalCartPriceAfterDiscount += item.totalPriceAfterDiscount;
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            cart: cart,
            totalCartPrice: totalCartPrice,
            totalCartPriceAfterDiscount: totalCartPriceAfterDiscount,
            productsCount: cart.products.length
        }
    }) ;
}) ;


 exports.updateCart = asyncHandler(async (req, res ,next) =>{
    const {productId, quantity, color} = req.body ;
    const userId = req.user._id ;
    const cart = await cartModel.findOne({ user: userId }) ;
    if(!cart){
        return next(new ApiError('Cart not found', 404)) ;
    }
    const product = await productModel.findById(productId) ;
    if(!product){
        return next(new ApiError('Product not found', 404)) ;
    }
    const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === productId
    ) ;
    if(existingProductIndex > -1){
        cart.products[existingProductIndex].quantity = quantity ;
        cart.products[existingProductIndex].color = color || undefined ;
        cart.products[existingProductIndex].totalPrice = product.price * quantity ;
        cart.products[existingProductIndex].totalPriceAfterDiscount = product.priceAfterDiscount ? product.priceAfterDiscount * quantity : product.price * quantity ;
    } else {
        cart.products.push({
            product: productId,
            quantity: quantity,
            price: product.price,
            totalPrice: product.price * quantity,
            totalPriceAfterDiscount: product.priceAfterDiscount ? product.priceAfterDiscount * quantity : product.price * quantity,
            color: color || undefined
        }) ;
    }
    await cart.save() ;
    res.status(200).json({
        status: 'product updated in cart successfully',
        data: cart
    }) ;

 })  ;


 exports.deleteProductFromCart = asyncHandler(async (req, res ,next) =>{
    const {productId} = req.params ;
    const userId = req.user._id ;
    const cart = await cartModel.findOne({ user: userId }) ;
    if(!cart){
        return next(new ApiError('Cart not found', 404)) ;
    }
    const product = await productModel.findById(productId) ;
    if(!product){
        return next(new ApiError('Product not found', 404)) ;
    }
    const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === productId
    ) ;
    if(existingProductIndex > -1){
        cart.products.splice(existingProductIndex, 1) ;
    }
    await cart.save() ;
    res.status(200).json({
        status: 'product deleted from cart successfully',
        data: cart
    }) ;

}) ;