const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Banner = require('../Model/Banner.modal');
const multer = require('multer');



//add memories
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/banner');
    },
    filename: function (req, file, cb) {
      const filename = file.originalname;
      cb(null, filename);
    },
  });
  
  const upload = multer({ storage: storage });
  exports.uploadImage = upload.single('bannerImg');


   //edit banner 
   const editstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/banner');
    },
    filename: function (req, file, cb) {
      const filename = file.originalname;
      cb(null, filename);
    },
  });
  
  const editupload = multer({ storage: editstorage });
  exports.edituploadImage = editupload.single('bannerImg');



//   exports.addBanner = catchAsync(async (req, res, next) => {
//     try {

//       const {subcategoryName} = req.body;
//       console.log(subcategoryName)
//         const data = {
//             bannerImg: req.file ? req.file.filename : null,
            
//           };

//          console.log(data)
//         const banner = await Banner.create(data);

//         res.json({
//           status: 'success',
//           message: 'Banner  added successfully.',
//           result: banner,
//         });

//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
// });

exports.addBanner = catchAsync(async (req, res, next) => {
  try {
    const { MaincategoryName, subcategoryName } = req.body;
    const { id } = req.params;
    console.log(subcategoryName, id);

    const data = {
      bannerImg: req.file ? req.file.filename : null,
      MaincategoryName:MaincategoryName,
      subcategoryName: subcategoryName,
      subCategoryBannerId: id,
    };

    console.log(data);

    const banner = await Banner.create(data);

    res.json({
      status: 'success',
      message: 'Banner added successfully.',
      result: banner,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


exports.editBanner = catchAsync(async (req, res, next) => {
  try {
    // Check if req.file exists before accessing its properties
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const updateData = {
      bannerImg: req.file.filename,
      subcategoryName: req.body.subcategoryName,
      MaincategoryName:req.body.MaincategoryName
    };

    const updatedTour = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedTour) {
      return res.status(404).json({ error: 'Id not found' });
    }

    res.json({
      status: 'success',
      message: 'BannerImg updated successfully',
      result: updatedTour,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

exports.getBanner = catchAsync(async (req, res, next) => {
  try {
      const allmemories = await Banner.find(); 

      res.json({
          status: 'success',
          result: allmemories,
          message: 'Banner Img get SuccesFully.'
      });
  } catch (error) {
      res.status(500).json({
          status: 'fail',
          message: 'Failed to retrieve data.',
      });
  } 
});

exports.deletemeBanner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return next(new Error('No id is provided!!'));
  }
  const deleteData = await Banner.findOneAndDelete({ _id: id });
  if (!deleteData) {
    return next(new Error('No product found with the provided id.', 404));
  }

  res.json({
    msg: 'delete successful!!',
    status: 'success',
    result: deleteData
  });
});