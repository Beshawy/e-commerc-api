const express = require('express');
const { signup , login , forgotPassword , verifyPasswordResetCode , resetPassword , refreshToken , logout } = require('../services/authService');

const router = express.Router(); 

const {signUpValidator  , loginValidator } = require('../utils/validators/authValidator');

router.post('/signup' ,signUpValidator , signup )  ;
router.post('/login',loginValidator , login ) ;
router.post('/refresh-token', refreshToken ) ;
router.post('/logout', logout ) ;
router.post('/forgotPassword' , forgotPassword ) ;
router.post('/verifyPasswordResetCode' , verifyPasswordResetCode ) ;
router.post('/resetPassword' , resetPassword ) ;

module.exports = router ;

