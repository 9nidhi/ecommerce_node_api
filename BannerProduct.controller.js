const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const AddBannerProduct = require('../Model/BannerProduct.modal');
const SubCategory = require('../Model/SubCategory.model');
const Category = require('../Model/MainCategory.model')


// Configure multer for storing uploaded images
const multer = require('multer');
const path = require('path');

const addStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    req.uploadedFileName = filename;
    cb(null, filename);
  },
});

const addUpload = multer({ storage: addStorage });
exports.uploadImage = addUpload.array('bannerPImg');

// update 
const updateStorage = multer.diskStorage({
    destination: function (req, file, cb) { 
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const filename = file.originalname;
      cb(null, filename);
    },
  });
  
  const updateUpload = multer({ storage: updateStorage });
  exports.uploadImageUpdate = updateUpload.array('bannerPImg');

  

exports.banneraddProduct = catchAsync(async (req, res, next) => {
    const data = req.body;
    const { bannerPName, price, details, discountPrice,subcategoryName, MaincategoryName,size,rating,bottomSize,shoesSize } = data;
    const subCatId = req.params.id;
  
    try {
      const existingSubCategory = await SubCategory.findOne({ id: subCatId });
  
      if (!existingSubCategory) {
        return res.status(404).json({
          status: 'fail',
          message: 'Subcategory not found.',
        });
      }
  
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Please upload at least one image.',
        });
      }
  
      if (req.files.length > 5) {
        return res.status(400).json({
          status: 'error',
          message: 'Only up to 5 images can be uploaded.',
        });
      }
  
      if(rating < 1 ||  rating > 5 || rating == -1){
        return res.status(400).json({
          status: 'error',
          message: 'Rating is required and should be between 1 and 5 and not allow negative value and 0..',
        });
      }
      const uploadedImages = req.files;
  
      const addProductData = new AddBannerProduct({  
        subCategoryId: existingSubCategory.id,
        bannerPName,
        price,
        details,
        discountPrice,
        subcategoryName,
        MaincategoryName,
        size: Array.isArray(data.size) ? data.size : [],
        bottomSize: Array.isArray(data.bottomSize) ? data.bottomSize : [],
        rating,
        shoesSize: Array.isArray(data.shoesSize) ? data.shoesSize : []
      });
      
      // Split the comma-separated strings to create arrays
      if (typeof size === 'string') {
        addProductData.size = size.split(',').map(s => s.trim());
      }
      
      if (typeof bottomSize === 'string') {
        addProductData.bottomSize = bottomSize.split(',').map(s => s.trim());
      }
      if (typeof shoesSize === 'string') {
        addProductData.shoesSize = shoesSize.split(',').map(s => s.trim());
      }
      console.log(addProductData);
      
    
      const imageFileNames = [];
  
      for (const image of uploadedImages) {
        imageFileNames.push(image.filename);
      }
  
      addProductData.bannerPImg = imageFileNames;
  
      // Check if at least one image is uploaded
      if (addProductData.bannerPImg.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Please upload image.',
        });
      }
  
      await addProductData.save();
  
      res.json({
        status: 'success',
        message: 'Data Added successfully.',
        result: addProductData,
      });
    } catch (error) {
      next(error);
    }
  });

  exports.getBannerAllProduct = catchAsync(async (req, res, next) => {
    const page = parseInt(req.params.page) || 1;
  
    const limit = parseInt(req.query.limit) || 20; 
  
    const skip = (page - 1) * limit;
    const totalCategories = await AddBannerProduct.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);
    const product = await AddBannerProduct.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
    res.json({
      status: 'success',
      message: 'Banner Product get successfully.',
      result: product,
      page: page,
      totalPages: totalPages
    });
  });

  exports.deleteBannerProduct = catchAsync(async (req, res, next) => {
    const { _id } = req.params;
  
    if (!_id) {
      return next(new Error('No id is provided!!'));
    }
    const deleteData = await AddBannerProduct.findOneAndDelete({ _id: _id });
    if (!deleteData) {
      return next(new Error('No product found with the provided id.', 404));
    }
  
    res.json({
      msg: 'delete successful!!',
      status: 'success',
      result: deleteData
    });
  });

  exports.updateBannerproduct = catchAsync(async (req, res, next) => {
    try {
    
      
      const updateData = {
        bannerPName: req.body.bannerPName,
        price: req.body.price,
        details: req.body.details,
        discountPrice: req.body.discountPrice,
        subcategoryName: req.body.subcategoryName,
        MaincategoryName: req.body.MaincategoryName,
        rating:req.body.rating,
        size: req.body.size ? req.body.size.split(',') : [],
        bottomSize: req.body.bottomSize ? req.body.bottomSize.split(',') : [],
        shoesSize: req.body.shoesSize ? req.body.shoesSize.split(',') : [],
      };
  
      console.log("updateData",updateData)
  
        if (req.files && req.files.length > 0) {
          if (req.files.length > 5) {
            return res.status(400).json({
              status: 'error',
                message: 'Please upload between 1 and 5 images.',
              });
            }
            updateData.bannerPImg = req.files.map((image) => image.filename);
          }

        
      const update = await AddBannerProduct.findByIdAndUpdate(req.params.id, updateData);
  
      if (!update) {
        return res.status(404).json({ error: 'Banner Product not found' });
      }
  
      const updatedProduct = await AddBannerProduct.findById(req.params.id).exec();
  
      res.json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  