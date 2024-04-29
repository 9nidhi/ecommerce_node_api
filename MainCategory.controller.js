const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const MainCategory = require('../Model/MainCategory.model')
const SubCategory = require('../Model/SubCategory.model')
const mongoose = require('mongoose');
const multer = require('multer');
const { ObjectId } = mongoose.Types; // Import ObjectId from mongoose


//add storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
exports.uploadImage = upload.single('categoryImg');



//edit storage
const storageedit = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    cb(null, filename);
  },
});

const uploadedit = multer({ storage: storageedit });
exports.uploadImageedit = uploadedit.single('categoryImg');

exports.mainCategoryName = catchAsync(async (req, res, next) => {
  // const data = req.body;
  // const { MaincategoryName } = data;

  // if (!MaincategoryName) return next(new AppError('Category Name is required.', 400));

  // const existingCategory = await MainCategory.findOne({ MaincategoryName });

  // if (existingCategory) {
  //   return res.status(400).json({
  //     status: 'fail',
  //     message: 'Category with the same name already exists.',
  //   });
  // }

  // if (req.file) {
  //   data.categoryImg = req.file.filename;
  // }

  // data.id = `CAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;
  // data.cart = data.cart || {};
  // data.cart.id = `CRT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

  // const user = await MainCategory.create(data);

  // res.json({
  //   status: 'success',
  //   message: 'Category added successfully.',
  //   result: user
  // });

  const data = req.body;
  console.log(data)
  const { MaincategoryName } = data;

  if (!MaincategoryName) return next(new AppError('Category Name is required.', 400));

  const existingCategory = await MainCategory.findOne({ MaincategoryName });

  if (existingCategory) {
    return res.status(400).json({
      status: 'fail',
      message: 'Category with the same name already exists.',
    });
  }

  if (!req.file) {
    return res.status(400).json({
      status: 'fail',
      message: 'Category Img is requireds.',
    });
  }


  // if (req.file) {
  //   data.categoryImg = req.file.filename;
  // }
  data.categoryImg = req.file.filename;


  data.id = `CAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;
  data.cart = data.cart || {};
  data.cart.id = `CRT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

  const newCategory = await MainCategory.create(data);

  res.json({
    status: 'success',
    message: 'Category added successfully.',
    result: newCategory
  });
});


// exports.getCategoryName = catchAsync(async (req, res, next) => {
//     const category = await MainCategory.find();

//     res.json({
//         staus: 'success',
//         message: 'Category get Succefully.',
//         result: category
//     });
// })

exports.getCategoryName = catchAsync(async (req, res, next) => {
  const page = parseInt(req.params.page) || 1;

  const limit = parseInt(req.query.limit) || 5; 

  const skip = (page - 1) * limit;
  const totalCategories = await MainCategory.countDocuments();
  const totalPages = Math.ceil(totalCategories / limit);
  const category = await MainCategory.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    status: 'success',
    message: 'Category get successfully.',
    result: category,
    page: page,
    totalPages: totalPages
  });
});

exports.deleteByCatId = async (req, res, next) => {
  // const catId = req.params.id;


  // try {
  //   await MainCategory.deleteByCatId(catId);



  //   res.json({
  //     status: 'success',
  //     message: 'Documents deleted successfully.',
  //   });
  // } catch (error) {
  //   next(error);
  // }

  const { id } = req.params;
  console.log(id);

  if (!id) {
    return next(new Error('No id is provided!!'));
  }
  const deleteData = await MainCategory.findOneAndDelete({ _id: id });
  if (!deleteData) {
    return next(new Error('No product found with the provided id.', 404));
  }

  res.json({
    msg: 'delete successful!!',
    status: 'success',
    result: deleteData
  });
};

//   exports.deleteCategoryData = catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     console.log(id);

//     if (!id) {
//         return next(new Error('No id is provided!!'));
//     }

//     // Assuming you have a field named 'customId' for your custom identifier
//     const deleteData = await MainCategory.findOneAndDelete({ id: id });


//     if (!deleteData) {
//         return next(new Error('No product found with the provided id.', 404));
//     }

//     res.json({
//         msg: 'delete successful!!',
//         status: 'success',
//         result: deleteData
//     });
// });

// exports.updateMaincategory = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   console.log(id)
//   const data = req.body;

//   if (!id) {
//     return next(new Error('No ID is provided!!'));
//   }

//   // Assuming you have a field named "customId" in your schema for custom IDs
//   const updatedata = await MainCategory.findOneAndUpdate(
//     { id: id },
//     data,
//     { new: true, runValidators: true }
//   );

//   if (!updatedata) {
//     return next(new Error('No product found with the provided custom ID.'));
//   }

//   res.json({
//     msg: 'Category updated successfully!!',
//     status: 'success',
//     result: updatedata,
//   });
// });


exports.updateMaincategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  if (!id) {
    return next(new Error('No ID is provided!!'));
  }

  // Update categoryImg only if it exists in the request body
  if (req.file) {
    data.categoryImg = req.file.filename; // Assuming you are using multer to handle file uploads
  }

  // Assuming you have a field named "customId" in your schema for custom IDs
  const updatedata = await MainCategory.findOneAndUpdate(
    { id: id },
    data,
    { new: true, runValidators: true }
  );

  if (!updatedata) {
    return next(new Error('No product found with the provided custom ID.'));
  }

  res.json({
    msg: 'Category updated successfully!!',
    status: 'success',
    result: updatedata,
  });
});

// exports.searchCategory = catchAsync(async (req, res, next) => {
//   try {
//     const searchQuery = req.params.q;
//     console.log(searchQuery);


//     if (searchQuery.startsWith('CAT-')) {

//       const category = await MainCategory.findOne({ id: searchQuery });

//       if (!category) {
//         return res.status(404).json({ message: 'Category not found' });
//       }

//       return res.status(200).json(category);
//     } else {
//       // Perform name-based search
//       const categories = await MainCategory.find({
//         MaincategoryName: { $regex: new RegExp(searchQuery, 'i') },
//       });

//       res.status(200).json(categories);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


// exports.searchCategory = catchAsync(async (req, res, next) => {
//   try {
//     const searchQueryName = req.query.MaincategoryName;

//     if (searchQueryName) {

//       const categories = await MainCategory.find({
//         MaincategoryName: { $regex: new RegExp(searchQueryName, 'i') },
//       });

//       res.status(200).json(categories);
//     } else {
//       res.status(400).json({ message: 'Invalid search parameters' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


exports.searchCategory = catchAsync(async (req, res, next) => {
  try {
      const searchQueryName = req.query.MaincategoryName;

      if (searchQueryName) {
          const categories = await MainCategory.find({
              MaincategoryName: { $regex: new RegExp(`^${searchQueryName}$`) },
          });
          // subCategoryName: { $regex: new RegExp(`^${subCategoryName}$`) },
          if (categories.length > 0) {
              res.status(200).json(categories);
          } else {
              res.status(404).json({ message: 'Data not found' });
          }
      } else {
          res.status(400).json({ message: 'Invalid search parameters' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


// exports.searchCategory = catchAsync(async (req, res, next) => {
//   try {
//     const searchQueryName = req.query.MaincategoryName;

//     if (searchQueryName) {
//       if (/^[0-9a-fA-F]{24}$/.test(searchQueryName)) {
//         res.status(400).json({ message: 'Please enter a valid parameter' });
//         return;
//       }

//       const categories = await MainCategory.find({
//         MaincategoryName: { $regex: new RegExp(searchQueryName, 'i') },
//       });

//       res.status(200).json(categories);
//     } else {
//       res.status(400).json({ message: 'Invalid search parameters' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
