const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const subCategory = require('../models/subCategoryModel');
const ApiError = require('../utils/apiError');
const categoryModel = require('../models/categoryModel');
const mongoose = require('mongoose');
const factory = require('./handlerFactory');

exports.setCategoryIdToBody = (req,res,next) =>{
    if(!req.body.category) req.body.category = req.params.categoryId;
    next() ;
}

// Create Subcategory
exports.createSubCategory = asyncHandler(async (req, res, next) => {
    const { name, category } = req.body;
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
        return next(new ApiError('Category not found', 404));
    }
    try {
        const newSubCategory = await subCategory.create({
            name,
            slug: slugify(name),
            category
        });
        res.status(201).json({ data: newSubCategory });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all products for specfic Category 
// يعنى هتجيب كل المنتجات الخاصة بكاتيجورى معين وليكن مثلا لابتوب dell هتجيب كل لابتوبات الخاصة بيه بموديلاته 

exports.createFilteredObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObject = filterObject;
    next();
}

// Get all Subcategories

exports.getSubCategories =  asyncHandler(async (req,res) =>{
   const page = req.query.page * 1 || 1 ;
   const limit = req.query.limit * 1 || 5 ;
   const skip = (page -1) * limit ;

 let filterObject = {} ;
    if(req.params.categoryId) filterObject = {category : req.params.categoryId} ;

   console.log(req.params) ; 
   const subCategories = await subCategory.find(req.filterObject).skip(skip).limit(limit).populate({path : 'category' , select : 'name -_id'}) ;
   res.status(200).json({results: subCategories.length , data : subCategories}) ;
})

 // GET specfic Subcategory by id

 exports.getSubCategory = asyncHandler(async (req, res, next) => {
   const { id } = req.params;
   if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Category not found', 404));
   }
   const getSubCategory = await subCategory.findById(id).populate({path : 'category' , select : 'name -_id'});
   if (!getSubCategory) {
      return next(new ApiError('Category not found', 404));
   }
   res.status(200).json({ data: getSubCategory });
})



 // Update Subcategory
   exports.updateSubCategory = asyncHandler (async (req,res,next) =>{
      const {id} = req.params ;
      const {name , category} = req.body ;
      const updateSubCategory = await subCategory.findByIdAndUpdate({_id:id} , 
      {name, slug : slugify(name)} , {new : true , runValidators : true}) ;
         if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Invalid SubCategory id', 400));
   }
      if(!updateSubCategory){
         return  next(new ApiError('subCategory not found' , 404)) ;
      }
      res.status(200).json({data : updateSubCategory}) ;
   })


   // Delete Subcategory 
   
   exports.deleteSubCategory = factory.deleteOne(subCategory) ;

   // exports.deleteSubCategory = asyncHandler (async (req,res,next) =>{
   //    const {id} = req.params ;
   //    const deleteSubCategory = await subCategory.findByIdAndDelete(id) ;
   //       if (!mongoose.Types.ObjectId.isValid(id)) {
   //    return next(new ApiError('Invalid category id', 400));
   // }
   //       if(!deleteSubCategory){
   //       return  next(new ApiError('SubCategory not found' , 404)) ;
   //    }
   //    res.status(200).json("SubCategory deleted successfully") ; 
   // }) ; 
