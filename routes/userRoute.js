const express = require('express');
const { getUsers,
     createUser ,
      getUser , 
      updateUser,
      deleteUser ,changeUserPassword ,uploadUserImage , resizeImage } = require('../services/userService');


const router = express.Router(); 


const { getUserValidator ,
     createUserValidator ,
     updateUserValidator ,
     deleteUserValidator } = require('../utils/validators/userValidator');



router.route('/')
.get( getUsers )
.post(createUser , uploadUserImage , resizeImage , createUserValidator ) ;

router.put('/changePassword/:id' , changeUserPassword) ;

router
.route('/:id')
.get(getUserValidator,getUser)
.put(updateUserValidator ,updateUser)
.delete(deleteUserValidator,deleteUser) ; 

module.exports = router ;