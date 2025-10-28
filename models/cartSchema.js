const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'Cart must be belong to a user'] ,
        unique : [true , 'Cart must be unique'] ,
    } ,
    products : [{
          product : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Product' , 
        required : [true , 'Cart must be belong to a product '] ,

          } ,
          quantity : {
            type : Number ,
            default : 1 ,
            required : [true] ,
            min : [1 , 'Quantity must be at least 1'] ,
            max : 100 ,
            validate : {
                validator  : function(val){
                  return val >= 1 && val <= 100 ;
                }
            }
          } ,
          price : {
            type  : Number ,
            required : true ,
            min : 0 ,
            max : 2000000000 ,
            validate :{
                validator : function(val){
                    return val >= 0 ;
                                    }
            }
          } ,
          totalPrice  : {
            type  : Number ,
            required  : true ,
            min  : 0 ,
            max  : 2000000000 ,
            validate :{
                validator : function(val){
                    return val >= 0 ;
                                    }
            }
          } ,
          totalPriceAfterDiscount  : {
             type : Number ,
             required  :true ,

          } ,
          createdAt  : {
            type  : Date ,
            default : Date.now ,
            required  : true , 
            immutable  :true ,
            select : false ,
          } ,
          updatedAt  : {
            type  : Date ,
            default : Date.now ,
            required  : true , 
            select : false ,
          } ,

    }]
}) 

const cartModel = mongoose.model('Cart' , cartSchema) ;

module.exports = cartModel ;