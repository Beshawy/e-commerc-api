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
 const userRoute = require('./routes/userRoute') ; 
 const authRoute = require('./routes/authRoute') ;



// connect db
dbConnection() ;


 const app = express();

// middleware
   app.use(express.json());
   if(process.env.NODE_ENV === 'development'){
      app.use(morgan('dev'));
      console.log(`mode : ${process.env.NODE_ENV}`); 
   }

// Route 
   app.use('/api/V1/categories' , categoryRoute) ;
   app.use('/api/V1/subCategories' , subCategoryRoute) ;
   app.use('/api/V1/brands' , brandRoute) ;
   app.use('/api/V1/products' , productRoute) ;
   app.use('/api/V1/users' , userRoute) ;
   app.use('/api/V1/auth' , authRoute) ;
     

  app.all(/.*/ , (req,res,next) =>{
      // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
      // next(err.message)
      next(new ApiError("message" , statusCode)) 

   }) ;
   // global error handler middleware 
   app.use(globalError) ;

 


const PORT = process.env.PORT  || 8000; 

 const server =  app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`); 
 })

 // Handler rejection outside express

 process.on('unhandledRejection' , (err) =>{
          console.error(`unhandleRejection Errors : ${err.name} | ${err.message}`);
          server.close(()=>{
            console.log('shutting down....');
               process.exit(1) ;
          }) ;
 }) ;



