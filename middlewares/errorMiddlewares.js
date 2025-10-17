const globalError = (err, req, res , next) => {
      err.statusCode = err.statusCode || 500 ;
      err.status = err.status || 'error' ;

      // لو الخطأ برمجي (غير متوقع)
      if (!err.isOperational) {
         return sendErrorForDev(err, res);
      }
      // لو الخطأ متوقع (مثل منتج غير موجود)
      sendErrorForProd(err, res);
    }
    ;

   const sendErrorForDev = (err,res) =>{
          res.status(err.statusCode).json({
         status : err.status ,
         error :err ,
         message : err.message ,
         stack : err.stack
      }) ;
   }

  const sendErrorForProd = (err, res) => {
  // خطأ معروف (operational error)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  // خطأ غير متوقع (programming error)
  else {
    console.error('ERROR 💥:', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

    module.exports = globalError ;