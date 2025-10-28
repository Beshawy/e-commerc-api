const slugify = require('slugify') ;
const asyncHandler = require('express-async-handler') ;
const Product = require('../models/productModel') ;
const ApiError = require('../utils/apiError') ;
const mongoose = require('mongoose') ; 
const ApiFeatures = require('../utils/apiFeatures') ;
const factory = require('./handlerFactory') ;

// Get all products

exports.getProducts =  asyncHandler(async (req,res) =>{
   const apiFeatures = new ApiFeatures(Product.find() , req.query)
   .filter()
   .search()
   .paginate()
   .limitFields()
   .sort() ;
   const { mongooseQuery , paginationResult } = apiFeatures ;
   const products = await mongooseQuery.populate({path : 'category' , select : 'name -_id' }) ; 

   res.status(200).json({results: products.length,paginationResult , data : products}) ;
})

 // GET specfic product by id

 exports.getProduct = asyncHandler(async (req, res, next) => {
   const { id } = req.params;
   if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Product not found', 404));
   }
   const getProduct= await Product.findById(id).populate({path : 'category' , select : 'name -_id' }) ;
   if (!getProduct) {
      return next(new ApiError('Product not found', 404));
   }
   res.status(200).json({ data: getProduct });
})

// Create product

   exports.creatProduct = asyncHandler(async (req, res, next) => {
    const { title, quantity, price, priceAfterDiscount, description, category, imageCover } = req.body;
    try {
        const product = await Product.create({
            title,
            slug: slugify(title),
            quantity,
            price,
            priceAfterDiscount,
            description,
            category,
            imageCover
        });
        res.status(201).json({ data: product });
    } catch (err) {
        next(err); // استخدم next لإظهار الخطأ بشكل واضح عبر error middleware
    }
}) ;

 // Update product
   exports.updateProduct = asyncHandler (async (req,res,next) =>{
      const {id} = req.params ;
      const {name} = req.body ;
      const updateProduct = await Product.findByIdAndUpdate({_id:id} , 
      {name, slug : slugify(name)} , {new : true , runValidators : true}) ;
         if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Invalid Product id', 400));
   }
      if(!updateProduct){
         return  next(new ApiError('Product not found' , 404)) ;
      }
      res.status(200).json({data : updateProduct}) ;
   })


   // Delete Product

   exports.deleteProduct = factory.deleteOne(Product) ;

   // exports.deleteProduct= asyncHandler (async (req,res,next) =>{
   //    const {id} = req.params ;
   //    const deleteProduct= await Product.findByIdAndDelete(id) ;
   //       if (!mongoose.Types.ObjectId.isValid(id)) {
   //    return next(new ApiError('Invalid Product id', 400));
   // }
   //       if(!deleteProduct){
   //       return  next(new ApiError('Product not found' , 404)) ;
   //    }
   //    res.status(200).json("Product deleted successfully") ;
   // })

