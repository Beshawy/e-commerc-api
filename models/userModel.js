const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcryptjs') ;

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    } ,
    slug : {
        type : String,
        required : true,
        lowercase : true,
    } ,
    email : {
        type : String,
        required : true,
        unique : [true , 'email must be unique'],
        lowercase : true,

    } ,
    phone  : String ,
    profileImg : String ,

    password : {
        type : String,
        required : true,
        minlength : [6 , 'password must be at least 6 characters'],

    } ,
    role : {
        type : String,
        enum : ['user' , 'admin' , 'super-admin'],
        default : 'user'
    } ,
     active :{
        type : Boolean,
        default : true
     } ,
},
{ timestamps : true }
) ;

userSchema.pre('save' , function(next) {
    if(!this.isModified('password')) {
        return next() ;
    } ;
   // hash user password 
   this.password = bcrypt.hashSync(this.password , 12) ;
   next() ;
})

// عمل slug تلقائي عند الحفظ إذا لم يكن موجودًا
userSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});


const User = mongoose.model('User' , userSchema) ;


module.exports = User ;