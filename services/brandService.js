const slugify = require('slugify') ;
const asyncHandler = require('express-async-handler') ;
const Brand = require('../models/brandModel') ;
const ApiError = require('../utils/apiError') ;
const mongoose = require('mongoose') ; 
const factory = require('./handlerFactory') ;

// Get all Brands

exports.getBrands =  asyncHandler(async (req,res) =>{
   const page = req.query.page * 1 || 1 ;
   const limit = req.query.limit * 1 || 5 ;
   const skip = (page -1) * limit ;
   const brands = await Brand.find({}).skip(skip).limit(limit) ;
   res.status(200).json({results: brands.length , data : brands}) ;
})

 // GET specfic Brand by id

 exports.getBrand = asyncHandler(async (req, res, next) => {
   const { id } = req.params;
   if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Invalid brand id', 400));
   }
   const brand = await Brand.findById(id);
   if (!brand) {
      return next(new ApiError('Brand not found', 404));
   }
   res.status(200).json({ data: brand });
})

// Create Brand

   exports.createBrand= asyncHandler( async (req,res) => {
      const {name} = req.body ;
      try{
      const brand = await Brand.create({name, slugify })
         res.status(201).json({data : brand}) ;
      } catch(err) {
         res.status(400).send(err) ;
       }
   }) ;

 // Update Brand
   exports.updateBrand = asyncHandler (async (req,res,next) =>{
      const {id} = req.params ;
      const {name} = req.body ;
      const updateBrand = await Brand.findByIdAndUpdate({_id:id} , 
      {name, slug : slugify(name)} , {new : true , runValidators : true}) ;
         if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Invalid Brand id', 400));
   }
      if(!updateBrand){
         return  next(new ApiError('Brand not found' , 404)) ;
      }
      res.status(200).json({data : updateBrand}) ;
   })


   // DFelete Brand

   // exports.deleteBrand = asyncHandler (async (req,res,next) =>{
   //    const {id} = req.params ;
   //    const deleteBrand = await Brand.findByIdAndDelete(id) ;
   //       if (!mongoose.Types.ObjectId.isValid(id)) {
   //    return next(new ApiError('Invalid Brand id', 400));
   // }
   //       if(!deleteBrand){
   //       return  next(new ApiError('Brand not found' , 404)) ;
   //    }
   //    res.status(200).json("Brand deleted successfully") ;
   // })

   exports.deleteBrand = factory.deleteOne(Brand) ; 

