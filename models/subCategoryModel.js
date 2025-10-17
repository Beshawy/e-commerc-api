const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name : {
         type : String,
         trim : true,
         unique : [true , 'SubCategory name must be unique'],
         required : [true , 'Please provide subCategory name'],
         minlength : [2 , 'SubCategory name must be at least 3 characters'],
         maxlength : [32 , 'SubCategory name is too large'] ,
    
    } ,
    slug : {
        type : String,
        lowercase : true
    } ,
    category : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Category' ,
        required : [true , 'SubCategory must be belong to a category']
    }
},
{timestamps : true}
) ;


 module.exports = mongoose.model('SubCategory' , subCategorySchema) ;