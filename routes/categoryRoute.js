const express = require('express');
const { getCategories, createCategory , getCategory , updateCategory ,deleteCategory  } = require('../services/categoryService');
const router = express.Router(); 
const { getCategoryValidator , createCategoryValidator , updateCategoryValidator , deleteCategoryValidator } = require('../utils/validators/categoryValidator');
const subCategoriesRoute = require('./subCategoryRoute') ;
const authService = require('../services/authService');


router.use('/:categoryId/subcategories' , subCategoriesRoute) ;


router.route('/')
  .get(getCategories)
  .post(authService.protect, authService.allowTo('admin','manager'), createCategoryValidator, createCategory); ;

router
.route('/:id')
.get(getCategoryValidator ,getCategory)
.put(updateCategoryValidator , updateCategory)
.delete( deleteCategoryValidator,deleteCategory) ; 

module.exports = router ;