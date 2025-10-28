const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcryptjs') ;




/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: المعرف الفريد للمستخدم (يتم إنشاؤه تلقائياً)
 *         name:
 *           type: string
 *           description: الاسم الكامل للمستخدم
 *           example: "أحمد محمد"
 *         email:
 *           type: string
 *           format: email
 *           description: البريد الإلكتروني للمستخدم
 *           example: "ahmed@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: كلمة مرور المستخدم (مشفرة)
 *           writeOnly: true
 *         passwordConfirm:
 *           type: string
 *           description: تأكيد كلمة المرور
 *           writeOnly: true
 *         role:
 *           type: string
 *           enum: [user, admin, manager]
 *           default: user
 *           description: دور المستخدم في النظام
 *           example: "user"
 *         profileImg:
 *           type: string
 *           description: صورة البروفايل الخاصة بالمستخدم
 *           example: "https://example.com/images/user-123.jpg"
 *         phone:
 *           type: string
 *           description: رقم هاتف المستخدم
 *           example: "+201234567890"
 *         active:
 *           type: boolean
 *           default: true
 *           description: حالة تفعيل الحساب
 *         addresses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *                 description: اسم تعريف العنوان (مثل المنزل، العمل)
 *                 example: "المنزل"
 *               street:
 *                 type: string
 *                 description: اسم الشارع
 *                 example: "123 شارع النزهة"
 *               city:
 *                 type: string
 *                 description: المدينة
 *                 example: "القاهرة"
 *               postalCode:
 *                 type: string
 *                 description: الرمز البريدي
 *                 example: "12345"
 *               isDefault:
 *                 type: boolean
 *                 default: false
 *                 description: هل هذا العنوان افتراضي؟
 *         wishlist:
 *           type: array
 *           items:
 *             type: string
 *           description: قائمة المنتجات المفضلة
 *         passwordChangedAt:
 *           type: string
 *           format: date-time
 *           description: تاريخ آخر تغيير لكلمة المرور
 *         passwordResetCode:
 *           type: string
 *           description: كود إعادة تعيين كلمة المرور
 *         passwordResetExpires:
 *           type: string
 *           format: date-time
 *           description: تاريخ انتهاء صلاحية كود إعادة التعيين
 *         passwordResetVerified:
 *           type: boolean
 *           description: هل تم التحقق من كود إعادة التعيين؟
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: تاريخ إنشاء الحساب
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: تاريخ آخر تحديث للحساب
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         name: "أحمد محمد"
 *         email: "ahmed@example.com"
 *         role: "user"
 *         profileImg: "https://example.com/images/user-123.jpg"
 *         phone: "+201234567890"
 *         active: true
 *         addresses:
 *           - alias: "المنزل"
 *             street: "123 شارع النزهة"
 *             city: "القاهرة"
 *             postalCode: "12345"
 *             isDefault: true
 *         wishlist: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
 *         createdAt: "2024-01-01T10:00:00.000Z"
 *         updatedAt: "2024-01-15T14:30:00.000Z"
 */


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
    passwordChangedAt : Date ,
    passwordForgetCode : String ,
    passwordResetCode : String ,
    passwordResetExpires : Date ,
    passwordResetVerified : Boolean ,
    role : {
        type : String,
        enum : ['user' , 'admin' , 'super-admin'],
        default : 'user'
    } ,
     active :{
        type : Boolean,
        default : true
     } ,
     
     // Refresh Tokens Management
     refreshTokens : [{
         token : {
             type : String,
             required : true
         },
         createdAt : {
             type : Date,
             default : Date.now,
             expires : '7d' // تلقائياً يحذف بعد 7 أيام
         },
         deviceInfo : {
             type : String,
             default : 'Unknown Device'
         },
         ipAddress : {
             type : String,
             default : 'Unknown IP'
         }
     }],
     
     // Security Settings
     lastLoginAt : Date,
     loginAttempts : {
         type : Number,
         default : 0
     },
     lockUntil : Date,
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