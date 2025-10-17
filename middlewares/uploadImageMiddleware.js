 const multer = require('multer');

// إعداد التخزين في الذاكرة
const storage = multer.memoryStorage();

// فلتر لقبول الصور فقط
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// إعداد الميدل وير
const upload = multer({ storage, fileFilter });

// ميدل وير لرفع صورة واحدة باسم معين
exports.uploadSingleImage = (fieldName) => upload.single(fieldName);