const express = require('express');
const { Router } = require('express');
const { createSubCategory ,getSubCategories , getSubCategory , updateSubCategory , deleteSubCategory , setCategoryIdToBody ,createFilteredObj } = require('../services/subCategoryService');
const { createSubCategoryValidator , getSubCategoryValidator ,updateSubCategoryValidator , deleteSubCategoryValidator} = require('../utils/validators/subCategoryValidator');

// mergeParams to access categoryId from parent route
// ex : We need to access categoryId in subCategoryRoute which is in categoryRoute

const router = express.Router({mergeParams : true}) ;  


router.route('/')
.post( setCategoryIdToBody ,createSubCategoryValidator ,createSubCategory)
.get(createFilteredObj,getSubCategories) ;



router.route('/:id')
.get(getSubCategoryValidator,getSubCategory)
.put(updateSubCategoryValidator,updateSubCategory)
.delete(deleteSubCategoryValidator,deleteSubCategory)


module.exports = router ;