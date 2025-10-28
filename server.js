const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config({path : 'config.env'});
const ApiError = require('./utils/apiError'); 
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');
const globalError = require('./middlewares/errorMiddlewares');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute') ;
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const cartRoute = require('./routes/cartRoutes');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// connect db
dbConnection() ;

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use(rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Cookie parser
app.use(cookieParser());

// middleware
   app.use(express.json());
   if(process.env.NODE_ENV === 'development'){
      app.use(morgan('dev'));
      console.log(`mode : ${process.env.NODE_ENV}`); 
   }


// Swagger Documentation
require('./config/swaggerConfig')(app);

// register routes (اضف هذه السطور قبل أي ميدل‌وير 404)
// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello besho' });
});

app.use('/api/V1/users', userRoute);
app.use('/api/V1/categories', categoryRoute);
app.use('/api/V1/subCategories', subCategoryRoute); 
app.use('/api/V1/brands', brandRoute);
app.use('/api/V1/products', productRoute);
app.use('/api/V1/auth', authRoute);
app.use('/api/V1/cart', cartRoute);

// handle unknown routes (بعد تسجيل كل الراوتات)
app.all(/.*/, (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);


const PORT = process.env.PORT  || 8000; 

// عند استخدام server variable عند إغلاق التطبيق تأكد أنه معرف:
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('unhandleRejection Errors :', err);
  server.close(() => {
    process.exit(1);
  });
});



