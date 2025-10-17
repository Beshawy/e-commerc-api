const slugify = require('slugify') ;
const asyncHandler = require('express-async-handler') ;
const User = require('../models/userModel') ;
const ApiError = require('../utils/apiError') ;
const {v4 , uuidv4} = require('uuid') ;
const apiError = require('../utils/apiError') ;
const mongoose = require('mongoose') ; 
const bcrypt = require('bcryptjs') ;
const sharp = require('sharp') ;
const factory = require('./handlerFactory') ;
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware') ;

//upload single image 
exports.uploadUserImage = uploadSingleImage('profileImg')  ;


// image processing
exports.resizeImage = asyncHandler (async (req,res,next) =>{
    const  filename = `user-${uuidv4()}-${Date.now()}.jpeg` ;

    await sharp(req.file.buffer)
    .resize(600 , 600)
    .toFormat('jpeg')
    .jpeg({quality : 90})
    .toFile(`uploads/users/${filename}`) ;

    req.body.profileImg = filename ;
    next() ;
})



// Get all Users

exports.getUsers =  asyncHandler(async (req,res) =>{
   const page = req.query.page * 1 || 1 ;
   const limit = req.query.limit * 1 || 5 ;
   const skip = (page -1) * limit ;
   const users = await User.find({}).skip(skip).limit(limit) ;
   res.status(200).json({results: users.length , data : users}) ;
})

 // GET specfic User by id

 exports.getUser = asyncHandler(async (req, res, next) => {
   const { id } = req.params;
   if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Invalid user id', 400));
   }
   const user = await User.findById(id);
   if (!user) {
      return next(new ApiError('user not found', 404));
   }
   res.status(200).json({ data:user });
})

// Create User 

   exports.createUser= asyncHandler( async (req,res) => {
      const {name ,email , password , phone } = req.body ;
      try{
      const user = await User.create({name, email, password,phone, slug: slugify(name) })
         res.status(201).json({data : user}) ;
      } catch(err) {
         res.status(400).send(err) ;
       }
   }) ;

 // Update User
   exports.updateUser = asyncHandler (async (req,res,next) =>{
      const updateUsers = await User.findByIdAndUpdate(req.params.id ,
         {
            name : req.body.name ,
            slug : slugify(req.body.name) ,
            email : req.body.email ,
            phone : req.body.phone ,
            profileImg : req.body.profileImg ,
            role : req.body.role
         } ,
         {new : true , runValidators : true}) ;
         if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Invalid user id', 400));
   }
      if(!updateUsers){
         return  next(new ApiError('user not found' , 404)) ;
      }
      res.status(200).json({data : updateUsers}) ;
   })

   exports.changeUserPassword = asyncHandler (async (req,res,next) =>{
            const updateUsers = await User.findByIdAndUpdate(req.params.id ,
         {
            password : await bcrypt.hash(req.body.password , 12) ,
         } ,
         {new : true , runValidators : true}) ;
         if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('Invalid user id', 400));
   }
      if(!updateUsers){
         return  next(new ApiError('user not found' , 404)) ;
      }
      res.status(200).json({data : updateUsers}) ;
   })


   exports.deleteUser = factory.deleteOne(User) ;

