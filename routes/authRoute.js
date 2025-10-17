const express = require('express');
const { signup , login } = require('../services/authService');


const router = express.Router(); 


const {signUpValidator  , loginValidator } = require('../utils/validators/authValidator');



router.route('/signup')
.post(signUpValidator , signup )  ;

router.route('/login')
.post(loginValidator , login ) ;

module.exports = router ;

