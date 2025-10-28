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
const createToken = require('../utils/createToken')  ;

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

   exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // تحقق مبكراً من الحقول المطلوبة
  if (!name) {
    return next(new ApiError('User name is required', 400));
  }

  // إنشاء الslug من الاسم المؤكد كـ string
  const slug = slugify(String(name));

  const user = await User.create({
    name,
    email,
    password,
    slug
  });

  user.password = undefined;
  res.status(201).json({ data: user });
}) ;

 // Update User
   exports.updateUser = asyncHandler (async (req,res,next) =>{
        const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return next(new ApiError('Invalid user id', 400));
      }
      const updateData = {};
      if (req.body.name) {
         updateData.name = req.body.name;
         updateData.slug = slugify(String(req.body.name));
      }
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.phone) updateData.phone = req.body.phone;
      if (req.body.profileImg) updateData.profileImg = req.body.profileImg;
      if (req.body.role) updateData.role = req.body.role;

      const updateUsers = await User.findByIdAndUpdate(req.params.id,
         updateData,
         {new : true , runValidators : true}) ;
      if(!updateUsers){
         return  next(new ApiError('user not found' , 404)) ;
      }
      res.status(200).json({data : updateUsers}) ;
   })

   exports.changeUserPassword = asyncHandler (async (req,res,next) =>{
            const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return next(new ApiError('Invalid user id', 400));
      }
            const updateUsers = await User.findByIdAndUpdate(req.params.id ,
         {
            password : await bcrypt.hash(req.body.password , 12) ,
            passwordChangedAt : Date.now()
         } ,
         {new : true , runValidators : true}) ;
      if(!updateUsers){
         return  next(new ApiError('user not found' , 404)) ;
      }
      res.status(200).json({data : updateUsers}) ;
   })


   exports.deleteUser = factory.deleteOne(User) ;


   // get logged user data 
   exports.getLoggedUserData = asyncHandler (async (req,res,next) =>{
      req.params.id = req.user._id ;
      next() ;
      const user = await User.findById(req.user._id) ;
      if(!user){
         return next (new ApiError('user not found' , 404)) ;
      }

   }) ;

   // update logged user data 
   exports.updateLoggedUserpassword = asyncHandler (async (req,res,next) =>{

        const user = await User.findByIdAndUpdate(
      req.user._id ,
      {
         password : await bcrypt.hash (req.body.password , 12) ,
         passwordChangedAt : Date.now() 
      } ,
      {
         new : true
      }
        ) ;
        // generate token 
      const token = createToken(user._id) ;

      res.status(200).json({data : user , token}) ;
   }) 


   exports.updateLoggedUserData = asyncHandler (async (req,res,next) =>{
      const updateData = await User.findByIdAndUpdate(
         req.user._id ,
         {
            name : req.body.name ,
            email : req.body.email ,
            phone : req.body.phone
         } ,
         {new : true , runValidators : true}
      ) ;
      res.status(200).json({data : updateData}) ;
   }) ;


   // deactivate user data 

   exports.deleteLoggedUserData = asyncHandler(async (req , res ,next) =>{
    await User.findByIdAndUpdate(req.user._id , {active : false}) ;

    res.status(200).json({status: 'succses'}) ;
   })


