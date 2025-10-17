const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const slugify = require('slugify');


const createToken = (payload) => {
    return jwt.sign({ userId : payload }, process.env.JWT_SECRET , {
            expiresIn : process.env.JWT_EXPIRE
    }) ;
} ;

exports.signup = asyncHandler(async (req,res , next)=>{
    const { name, email, password } = req.body;
    // تحقق من وجود الحقول الأساسية أولاً (أو يعتمد على validators)
    const user = await User.create({
        name,
        email,
        password,
        slug: slugify(name) // <-- هنا نولد الـ slug
    });
    // generate token 
    const token = createToken(user._id) ;
    res.status(201).json({data : user , token}) ;
}) ;

 exports.login = asyncHandler(async (req,res,next) =>{
    const {email , password} = req.body ;
    // check if user exist
    const user = await User.findOne({email}) ;
    if(!user || await bcrypt.compare(password , user.password)) {
        return next(new ApiError('Incorrect email or password' , 401)) ;
    } ;
    // check if password is correct
    const isPasswordCorrect = await user.isPasswordMatched(password) ;
    if(!isPasswordCorrect) {
        return next(new ApiError('Incorrect email or password' , 401)) ;
    } ; 
    // generate token 
    const token = createToken(user._id) ;

    res.status(200).json({data : user , token}) ;

 })