const asyncHandler = require('express-async-handler') ;
const ApiError = require('../utils/apiError') ;
const mongoose = require('mongoose') ; 
const ApiFeatures = require('../utils/apiFeatures') ;

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new ApiError('Document not found', 404));
    }
    res.status(200).json({ message: 'Deleted successfully' });
  });