 class ApiError extends Error {
    constructor(messge , statusCode) {
        super(messge) ;
        this.statusCode = statusCode ;
        Error.captureStackTrace(this , this.constructor) ;
    }
 }

 module.exports = ApiError ;