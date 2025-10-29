const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const slugify = require('slugify');
const { sendEmail } = require("../utils/sendEmail");

const { createTokenPair, verifyAccessToken, verifyRefreshToken } = require('../utils/tokenManager');

exports.signup = asyncHandler(async (req,res , next)=>{
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        slug: slugify(name) 
    });
    // generate token 
    const token = createToken(user._id) ;
    res.status(201).json({data : user , token}) ;
}) ;

 exports.login = asyncHandler(async (req,res,next) => {
    const { email, password } = req.body;
    
    // جلب المستخدم مع كلمة السر
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ApiError('Incorrect email or password', 401));
    }

    // تحقق من كلمة السر
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return next(new ApiError('Incorrect email or password', 401));
    }

    // إنشاء زوج من الـ tokens
    const { accessToken, refreshToken } = createTokenPair(user._id);
    
    // حفظ refresh token في قاعدة البيانات
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown IP';
    
    user.refreshTokens.push({
        token: refreshToken,
        deviceInfo,
        ipAddress
    });
    
    // تحديث آخر تسجيل دخول
    user.lastLoginAt = new Date();
    user.loginAttempts = 0; // إعادة تعيين محاولات الدخول
    
    await user.save();
    
    // إخفاء البيانات الحساسة
    user.password = undefined;
    user.refreshTokens = undefined;
    
    res.status(200).json({ 
        status: 'success',
        data: user, 
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRE || '15m'
    });
});

// تجديد الـ tokens
exports.refreshToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return next(new ApiError('Refresh token is required', 400));
    }
    
    try {
        // التحقق من صحة refresh token
        const decoded = verifyRefreshToken(refreshToken);
        
        // البحث عن المستخدم والتحقق من وجود الـ token في قاعدة البيانات
        const user = await User.findById(decoded.userId);
        if (!user) {
            return next(new ApiError('User not found', 404));
        }
        
        // التحقق من وجود الـ refresh token في قاعدة البيانات
        const tokenExists = user.refreshTokens.some(tokenObj => tokenObj.token === refreshToken);
        if (!tokenExists) {
            return next(new ApiError('Invalid refresh token', 401));
        }
        
        // إنشاء زوج جديد من الـ tokens
        const { accessToken, refreshToken: newRefreshToken } = createTokenPair(user._id);
        
        // حذف الـ refresh token القديم وإضافة الجديد
        user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken);
        
        const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
        const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown IP';
        
        user.refreshTokens.push({
            token: newRefreshToken,
            deviceInfo,
            ipAddress
        });
        
        await user.save();
        
        res.status(200).json({
            status: 'success',
            accessToken,
            refreshToken: newRefreshToken,
            expiresIn: process.env.JWT_EXPIRE || '15m'
        });
        
    } catch (error) {
        return next(new ApiError('Invalid refresh token', 401));
    }
});

// تسجيل الخروج (حذف refresh token)
exports.logout = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return next(new ApiError('Refresh token is required', 400));
    }
    
    try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.userId);
        
        if (user) {
            // حذف الـ refresh token من قاعدة البيانات
            user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken);
            await user.save();
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
        
    } catch (error) {
        return next(new ApiError('Invalid refresh token', 401));
    }
});

exports.protect = asyncHandler(async (req, res, next) => {
    // Check if token exists 
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
        return next(new ApiError('You are not logged in! please login to get access',401)) ;
    }
    const token = req.headers.authorization.split(' ')[1] ;
    if(!token){
        return next(new ApiError('You are not logged in! please login to get access' , 401)) ;
    }

    try {
        // verify token using new token manager
        const decoded = verifyAccessToken(token);
        
        // check if user still exists
        const currentUser = await User.findById(decoded.userId) ;
        if(!currentUser){
            return next(new ApiError('The user that belong to this token does no longer exist' , 401)) ;
        }
        
        // check if user changed password after token was issued
        if(currentUser.passwordChangedAt){
            const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000 , 10) ;
            if(passChangedTimestamp > decoded.iat){
                return next(new ApiError('User recently changed password! please login again' , 401))
            }
        }
        
        req.user = currentUser ;
        next() ;
        
    } catch (error) {
        return next(new ApiError('Invalid or expired token', 401));
    }
});

// add this helper middleware
exports.allowTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError('You do not have permission to perform this action', 403));
    }
    next();
  };
};


exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return next(new ApiError('There is no user with this email', 404));
    }

    // generate 6-digit code and hash it with a supported algorithm
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    // save reset code to db
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.passwordResetVerified = false;
    await user.save();

    const message = `Hi ${user.name}, \nYour password reset code is: ${resetCode}`;

    // 🎯 الحل النهائي: اطبع الكود واكمل التطوير
    console.log('🎯 ===== كود إعادة التعيين =====');
    console.log('🔢 الكود:', resetCode);
    console.log('📧 للإيميل:', user.email);
    console.log('⏰ صالح لمدة 10 دقائق');
    console.log('🎯 ============================');

    // حاول ترسل الإيميل، إذا فشل اكمل عادي
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (valid for 10 min)',
            message
        });
        console.log('✅ الإيميل أُرسل بنجاح');
    } catch(err) {
        console.log('⚠️  فشل إرسال الإيميل، لكن الكود محفوظ في الداتابيز');
        // ما تمسحش البيانات علشان تقدر تستخدم الكود من الكونسول
    }
    
    res.status(200).json({
        status: 'success', 
        message: 'Reset code generated successfully'
    });
});


exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
    // get user based on the reset code
    const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() }
    }) ;
    if(!user){
        return next(new ApiError('Reset code is invalid or has expired' , 400)) ;
    }
    // reset code is valid 
    user.passwordResetVerified = true ;
    await user.save() ;
    res.status(200).json({ status : 'success' , message : 'Reset code is valid'}) ;
})


exports.resetPassword = asyncHandler(async (req , res , next) =>{
    const user = await User.findById(req.user._id).select('+passwordResetVerified') ;
    if(!user.passwordResetVerified){
        return next (new ApiError('You must verify your reset code first' , 400)) ;

    }
    if(!user){
        return next (new ApiError('User not found' , 404)) ;
    } ;
    user.password = req.body.newPassword ;
    user.passwordResetCode = undefined ;
    user.passwordResetExpires = undefined ;
    user.passwordResetVerified = undefined ;
    await user.save() ;

    // if you want to login immediately after reset password , generate token
    const token = createToken(user._id) ;
    res.status(200).json({ status : 'success' , message : 'Password reset successful' , token}) ;

})