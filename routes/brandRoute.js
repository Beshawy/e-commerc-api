const express = require('express');
const { getBrands,
     createBrand ,
      getBrand , 
      updateBrand,
      deleteBrand } = require('../services/brandService');
const router = express.Router(); 


const { getBrandValidator ,
     createBrandValidator ,
     updateBrandValidator ,
     deleteBrandValidator } = require('../utils/validators/brandValidator');



router.route('/')
.get( getBrands )
.post( createBrandValidator ,createBrand) ;

router
.route('/:id')
.get(getBrandValidator ,getBrand)
.put(updateBrandValidator , updateBrand)
.delete( deleteBrandValidator,deleteBrand) ; 

module.exports = router ;