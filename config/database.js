const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    // استخدام رابط احتياطي في حالة عدم وجود متغير البيئة
    const dbUrl = process.env.DB_URL || process.env.DATABASE_URL || process.env.MONGODB_URI;
    
    if (!dbUrl) {
      throw new Error('متغير البيئة DB_URL غير موجود. يرجى التأكد من إضافته في ملف config.env أو في متغيرات البيئة في Railway');
    }
    
    console.log('Connecting to DB with:', dbUrl); // للتشخيص
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connected');
  } catch (err) {
    console.error('DB connection error:', err.message);
    console.error('تأكد من إضافة متغير DB_URL في Railway بشكل صحيح');
    process.exit(1);
  }
};

module.exports = dbConnection;