const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
   name : {
      type : String,
      required : [true , 'Please provide Brand name'],
      unique : [true , 'Brand name must be unique'],
      minlength : [3 , 'Brsand name must be at least 3 characters'],
      maxlength : [32 , 'Brand name is too large']
   },
   slug : {
      type : String,
      lowercase : true
   },
   image : String , 
   
} ,
{timestamps : true}
)

const brandModel = mongoose.model('Brand' , brandSchema);

module.exports = brandModel ; 