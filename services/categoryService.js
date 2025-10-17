const slugify = require('slugify') ;
const asyncHandler = require('express-async-handler') ;
const category = require('../models/categoryModel') ;
const ApiError = require('../utils/apiError') ;
const mongoose = require('mongoose') ; 
const factory = require('./handlerFactory') ;

// Get all categories

exports.getCategories =  asyncHandler(async (req,res) =>{
   const page = req.query.page * 1 || 1 ;
   const limit = req.query.limit * 1 || 5 ;
   const skip = (page -1) * limit ;
   const categories = await category.find({}).skip(skip).limit(limit) ;
   res.status(200).json({results: categories.length , data : categories}) ;
})

 // GET specfic category by id

 exports.getCategory = asyncHandler(async (req, res, next) => {
   const { id } = req.params;
   if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Category not found', 404));
   }
   const getCategory = await category.findById(id);
   if (!getCategory) {
      return next(new ApiError('Category not found', 404));
   }
   res.status(200).json({ data: getCategory });
})

// Create category

   exports.createCategory = asyncHandler( async (req,res) => {
      const {name} = req.body ;
      try{
      const category = await category.create({name, slugify })
         res.status(201).json({data : category}) ;
      } catch(err) {
         res.status(400).send(err) ;
       }
   }) ;

 // Update category
   exports.updateCategory = asyncHandler (async (req,res,next) =>{
      const {id} = req.params ;
      const {name} = req.body ;
      const updateCategory = await category.findByIdAndUpdate({_id:id} , 
      {name, slug : slugify(name)} , {new : true , runValidators : true}) ;
         if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Invalid category id', 400));
   }
      if(!updateCategory){
         return  next(new ApiError('Category not found' , 404)) ;
      }
      res.status(200).json({data : updateCategory}) ;
   })


   // DFelete category  

   exports.deleteCategory = factory.deleteOne(category) ;

   // exports.deleteCategory = asyncHandler (async (req,res,next) =>{
   //    const {id} = req.params ;
   //    const deleteCategory = await category.findByIdAndDelete(id) ;
   //       if (!mongoose.Types.ObjectId.isValid(id)) {
   //    return next(new ApiError('Invalid category id', 400));
   // }
   //       if(!deleteCategory){
   //       return  next(new ApiError('Category not found' , 404)) ;
   //    }
   //    res.status(200).json("Category deleted successfully") ;
   // })

