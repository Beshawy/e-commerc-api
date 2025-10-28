const express = require('express');
const { getUsers,
     createUser ,
      getUser , 
      updateUser,
      deleteUser ,changeUserPassword ,
      uploadUserImage ,
      resizeImage , getLoggedUserData , updateLoggedUserPassword , updateLoggedUserData , deleteLoggedUserData } = require('../services/userService');


const authService = require('../services/authService');
const router = express.Router();



router.use(authService.protect , authService.allowTo('admin' , 'manager')) ;

router.get('/getMe' , authService.protect , getLoggedUserData , getUser) ; 


// admin 

if (typeof changeUserPassword !== 'function' || typeof updateLoggedUserPassword !== 'function') {
  console.error('Route handlers missing:', {
    changeUserPassword: typeof changeUserPassword,
    updateLoggedUserPassword: typeof updateLoggedUserPassword ,
    updateLoggedUserData: typeof updateLoggedUserData
  });
  // تعليق الراوت أو رمي خطأ واضح بدل كراش عند require
} else {
  router.put('/changeMyPassword', authService.protect, changeUserPassword, updateLoggedUserPassword);
  router.put('/updateMe', authService.protect, uploadUserImage, resizeImage, updateLoggedUserData);
  router.delete('/deleteMe' , authService.protect , deleteLoggedUserData) ;
}

const { getUserValidator ,
     createUserValidator ,
     updateUserValidator ,
     deleteUserValidator  } = require('../utils/validators/userValidator');



router.route('/')
  .get(getUsers)
  .post(authService.allowTo('admin'), uploadUserImage, resizeImage, createUser , createUserValidator);

router.route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

console.log('userService handlers types:', {
  getUsers: typeof getUsers,
  createUser: typeof createUser,
  getUser: typeof getUser,
  updateUser: typeof updateUser,
  deleteUser: typeof deleteUser,
  changeUserPassword: typeof changeUserPassword,
  updateLoggedUserPassword: typeof updateLoggedUserPassword,
  uploadUserImage: typeof uploadUserImage,
  resizeImage: typeof resizeImage,
  getLoggedUserData: typeof getLoggedUserData
});

module.exports = router;