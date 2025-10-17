const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   name : {
      type : String,
      required : [true , 'Please provide category name'],
      unique : [true , 'Category name must be unique'],
      minlength : [3 , 'Category name must be at least 3 characters'],
      maxlength : [32 , 'Category name is too large']
   },
   slug : {
      type : String,
      lowercase : true
   },
   image : String , 
   
} ,
{timestamps : true}
)

const categoryModel = mongoose.model('Category' , categorySchema);

module.exports = categoryModel ; 