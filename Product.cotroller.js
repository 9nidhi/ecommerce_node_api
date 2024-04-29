const _ = require("lodash");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../Model/Product.model");
const SubCategory = require("../Model/SubCategory.model");
const Category = require("../Model/MainCategory.model");
var FormData = require("form-data");
const formidable = require("formidable");
const fs = require("fs");
const bodyParser = require("body-parser");
const pluralize = require("pluralize");

// Configure multer for storing uploaded images
const multer = require("multer");
const path = require("path");

const addStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    req.uploadedFileName = filename;
    cb(null, filename);
  },
});

const addUpload = multer({ storage: addStorage });
exports.uploadImage = addUpload.array("pImg");

const updateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    cb(null, filename);
  },
});

const updateUpload = multer({ storage: updateStorage });
exports.uploadImageUpdate = updateUpload.array("pImg");

// exports.addProduct = catchAsync(async (req, res, next) => {
//   const data = req.body;
//   const { pName, price, details, discountPrice,MaincategoryName } = data;
//   const subCatId = req.params.id;

//   try {
//     const existingSubCategory = await SubCategory.findOne({ id: subCatId });

//     if (!existingSubCategory) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Subcategory not found.',
//       });
//     }

//     if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Please upload at least one image.',
//       });
//     }

//     if (req.files.length > 5) {

//       return res.status(400).json({
//         status: 'error',
//         message: 'Only up to 5 images can be uploaded.',
//       });
//     }

//     const uploadedImages = req.files;

//     const addProductData = new Product({
//       subCategoryId: existingSubCategory.id,
//       pName: pName,
//       price: price,
//       details: details,
//       discountPrice: discountPrice,
//       subcategoryName: data.SubCateoryName,
//       MaincategoryName: data.MaincategoryName,
//     });
// console.log("addProductData",addProductData)
//     const imageFileNames = [];

//     // Iterate over the uploaded images and store their filenames
//     for (const image of uploadedImages) {
//       imageFileNames.push(image.filename);
//     }

//     addProductData.pImg = imageFileNames;

//     await addProductData.save();

//     res.json({
//       status: 'success',
//       message: 'Data Added successfully.',
//       result: addProductData,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// function getSize(){
//   if(data.size == null){
//     if(data.bottomSize == null){
//       if(data.shoesSize == null){
//         return [];
//       } else {
//         return data.shoesSize;
//       }
//     } else {
//       return data.bottomSize;
//     }
//   } else {
//     return data.size;
//   }
// }

exports.addProduct = catchAsync(async (req, res, next) => {
  const data = req.body;
  const {
    pName,
    price,
    details,
    discountPrice,
    subcategoryName,
    MaincategoryName,
    size,
    rating,
    bottomSize,
    shoesSize,
    stock
  } = data;
  const subCatId = req.params.id;

  try {
    const existingSubCategory = await SubCategory.findOne({ id: subCatId });

    if (!existingSubCategory) {
      return res.status(404).json({
        status: "fail",
        message: "Subcategory not found.",
      });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Please upload at least one image.",
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        status: "error",
        message: "Only up to 5 images can be uploaded.",
      });
    }

    if (rating < 1 || rating > 5 || rating == -1) {
      return res.status(400).json({
        status: "error",
        message:
          "Rating is required and should be between 1 and 5 and not allow negative value and 0..",
      });
    }
    const uploadedImages = req.files;

    const addProductData = new Product({
      subCategoryId: existingSubCategory.id,
      pName,
      price,
      details,
      discountPrice,
      subcategoryName,
      MaincategoryName,
      size: Array.isArray(data.size) ? data.size : [],
      bottomSize: Array.isArray(data.bottomSize) ? data.bottomSize : [],
      rating,
      shoesSize: Array.isArray(data.shoesSize) ? data.shoesSize : [],
      stock
    });

    // Split the comma-separated strings to create arrays
    if (typeof size === "string") {
      addProductData.size = size.split(",").map((s) => s.trim());
    }

    if (typeof bottomSize === "string") {
      addProductData.bottomSize = bottomSize.split(",").map((s) => s.trim());
    }
    if (typeof shoesSize === "string") {
      addProductData.shoesSize = shoesSize.split(",").map((s) => s.trim());
    }
    console.log(addProductData);

    const imageFileNames = [];

    for (const image of uploadedImages) {
      imageFileNames.push(image.filename);
    }

    addProductData.pImg = imageFileNames;

    // Check if at least one image is uploaded
    if (addProductData.pImg.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Please upload image.",
      });
    }

    await addProductData.save();

    res.json({
      status: "success",
      message: "Data Added successfully.",
      result: addProductData,
    });
  } catch (error) {
    next(error);
  }
});

exports.getAllProduct = catchAsync(async (req, res, next) => {
  const page = parseInt(req.params.page) || 1;

  const limit = parseInt(req.query.limit) ;

  const skip = (page - 1) * limit;
  const totalCategories = await Product.countDocuments();
  const totalPages = Math.ceil(totalCategories / limit);
  const product = await Product.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    status: "success",
    message: "Product get successfully.",
    result: product,
    page: page,
    totalPages: totalPages,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { _id } = req.params;

  if (!_id) {
    return next(new Error("No id is provided!!"));
  }
  const deleteData = await Product.findOneAndDelete({ _id: _id });
  if (!deleteData) {
    return next(new Error("No product found with the provided id.", 404));
  }

  res.json({
    msg: "delete successful!!",
    status: "success",
    result: deleteData,
  });
});

exports.allcatWiseProduct = catchAsync(async (req, res, next) => {
  try {
    // Find all MainCategories
    const mainCategories = await Category.find();

    const productsByMainCategory = [];
    for (const mainCategory of mainCategories) {
      const products = await Product.find({
        MaincategoryName: mainCategory.MaincategoryName,
      })
        .select("pName pImg")
        .lean();

      products.forEach((product) => {
        if (product.pImg.length > 2) {
          product.pImg = product.pImg.slice(0, 2);
        }
      });

      productsByMainCategory.push({
        categoryName: mainCategory.MaincategoryName,
        products,
      });
    }
    res.json({ productsByMainCategory });
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  try {
    const updateData = {
      pName: req.body.pName,
      price: req.body.price,
      details: req.body.details,
      discountPrice: req.body.discountPrice,
      subcategoryName: req.body.subcategoryName,
      MaincategoryName: req.body.MaincategoryName,
      rating: req.body.rating,
      size: req.body.size ? req.body.size.split(",") : [],
      bottomSize: req.body.bottomSize ? req.body.bottomSize.split(",") : [],
      shoesSize: req.body.shoesSize ? req.body.shoesSize.split(",") : [],
      stock: req.body.stock
    };

    console.log("updateData", updateData);

    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({
          status: "error",
          message: "Please upload between 1 and 5 images.",
        });
      }
      updateData.pImg = req.files.map((image) => image.filename);
    }

    // if (req.files) {
    //   if (req.files.length === 0 || req.files.length > 5) {
    //     return res.status(400).json({
    //       status: 'error',
    //       message: 'Please upload between 1 and 5 images.',
    //     });
    //   }
    //   updateData.pImg = req.files.map((image) => image.filename);
    // }

    const update = await Product.findByIdAndUpdate(req.params.id, updateData);

    if (!update) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await Product.findById(req.params.id).exec();

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.searchProduct = async (req, res) => {
  try {
    const { pName, price, discountPrice, subcategoryName, MaincategoryName } =
      req.query;

    let query = {};
    console.log(query);

    if (pName) {
      query.pName = { $regex: new RegExp(pName) };
    }

    if (price) {
      query.price = parseFloat(price);
    }

    if (discountPrice) {
      query.discountPrice = parseFloat(discountPrice);
    }

    if (subcategoryName) {
      query.subcategoryName = subcategoryName; // Exact match for subcategory name
    }

    if (MaincategoryName) {
      query.MaincategoryName = MaincategoryName; // Exact match for main category name
    }

    const products = await Product.find(query);
    if (products.length > 0) {
      return res.status(200).json(products);
    } else {
      return res.status(404).json({ message: "Data not Found ." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.Allproduct = catchAsync(async (req, res, next) => {
  // const page = parseInt(req.params.page) || 1;
  // const limit = parseInt(req.query.limit) || 16;
  // const skip = (page - 1) * limit;

  // const product = await Product.find().sort({ createdAt: -1 })
  //           .skip(skip)
  //           .limit(limit);

  //           const totalPages = Math.ceil(product / limit);

  // res.json({
  //   status: 'success',
  //   message: ' get product successfully.',
  //   result: product,

  //   page: page,
  //   totalPages: totalPages
  // });

  const page = parseInt(req.params.page) || 1;

  const limit = parseInt(req.query.limit) || 16;

  const skip = (page - 1) * limit;
  const totalCategories = await Product.countDocuments();
  const totalPages = Math.ceil(totalCategories / limit);
  const product = await Product.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    status: "success",
    message: "Product get successfully.",
    result: product,
    page: page,
    totalPages: totalPages,
  });
});

exports.sortingproduct = async (req, res) => {
  try {
    const subcategory = req.params.subcategoryName;
    console.log(subcategory);

    const products = await Product.find({ subcategoryName: subcategory }).sort({
      price: 1,
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addTocart = async (req, res) => {
  try {
    const { productId, quantity } = req.body; // Assuming you send productId and quantity in the request body
    const userId = req.user._id; // Assuming you have a user object in the request after authentication

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if quantity is greater than 0
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    // Check if the user already has a cart
    let cart =66;

    // Check if the product already exists in the cart
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      // Update quantity and total price if the product already exists in the cart
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * product.price;
    } else {
      // Add a new item to the cart if the product doesn't exist
      const newItem = {
        productId,
        quantity,
        totalPrice: quantity * product.price,
        // You can also include other product details like name, image, etc.
      };
      cart.items.push(newItem);
    }

    // Update the cart in the database
    // You need to implement the logic to save or update the cart in your database
    // This may involve updating a user document with the new cart information
    await User.findByIdAndUpdate(userId, { cart }, { new: true });

    return res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

}
// exports.searchAllproduct = async (req, res) => {
//   try {
//     const { q } = req.query;
//     console.log(req.query);

//     let query = {};

//     if (q) {
//       query.$or = [
//         { pName: { $regex: new RegExp(q, 'i') } },
//         { subcategoryName: { $regex: new RegExp(q, 'i') } },
//         { MaincategoryName: { $regex: new RegExp(q, 'i') } },
//         // Add more fields if needed
//       ];
//     }

//     const products = await Product.find(query);

//     if (products.length > 0) {
//       return res.json({
//         status: 'success',
//         message: 'Products retrieved successfully.',
//         result: products,
//       });
//     } else {
//       return res.status(404).json({ message: 'Data not found.' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// exports.searchAllproduct = async (req, res) => {
//   const searchTerm = req.query.q;

//   // Check if searchTerm exists
//   if (!searchTerm) {
//     return res.status(400).json({ error: "Search term is required" });
//   }

//   // const page = parseInt(req.query.page) || 1;
//   // const limit = parseInt(req.query.limit) || 16;
//   // const skip = (page - 1) * limit;

//   const modifiedSearchTerm = searchTerm.replace(
//     /for/g,
//     "for ".padStart("for ".length + 1)
//   );

//   try {
//     // caetgeory
//     const category = await Category.find();

//     let categoryList = [];
//     if (category.length) {
//       categoryList = category.map((_ct) => _ct.MaincategoryName.toLowerCase());
//     }

//     const searchTermSplitted = modifiedSearchTerm
//       .split(" ")
//       .filter((term) => term)
//       .map((term) => term.toLowerCase());

//     const availableCategory = [];
//     searchTermSplitted.forEach((_ct) => {
//       const index = categoryList.indexOf(_ct);
//       const indexSingular = categoryList.indexOf(pluralize.singular(_ct));
//       const indexPlural = categoryList.indexOf(pluralize.plural(_ct));

//       if (index >= 0) {
//         !availableCategory.includes(categoryList[index]) &&
//           availableCategory.push(categoryList[index]);
//       }
//       if (pluralize.isPlural(_ct) && indexSingular >= 0) {
//         !availableCategory.includes(categoryList[indexSingular]) &&
//           availableCategory.push(categoryList[indexSingular]);
//       }
//       if (pluralize.isSingular(_ct) && indexPlural >= 0) {
//         !availableCategory.includes(categoryList[indexPlural]) &&
//           availableCategory.push(categoryList[indexPlural]);
//       }
//     });

//     // -------------------------------------------------------------------------------

//     const query = {};
//     if (_.size(availableCategory)) {
//       let searchableMainCategory = availableCategory.map(
//         (item) => new RegExp(`^${item}$`, "i")
//       );
//       console.log("searchableMainCategory =>", searchableMainCategory);

//       query.mainCategoryName = { $in: searchableMainCategory };
//     }
//     console.log("query =>", query);

//     const subcategory = await SubCategory.find(query);
//     // console.log(' subcategory=>',subcategory);

//     // subcategoey

//     let subcategoryList = [];

//     if (subcategory.length) {
//       subcategoryList = subcategory.map((_st) =>
//         _st.SubCateoryName.toLowerCase()
//       );
//     }

//     console.log("subcategoryList =>", subcategoryList);
//     const availableSubCategory = [];
//     subcategoryList.forEach((_ct) => {
//       if (modifiedSearchTerm.includes(_ct)) {
//         !availableSubCategory.includes(_ct) && availableSubCategory.push(_ct);
//       }
//     });

//     // -------------------------------------------------------------------------------
//     if (availableCategory.length && availableSubCategory.length) {
//       let search = availableCategory.map(
//         (item) => new RegExp(`^${item}$`, "i")
//       );
//       let serchsub = availableSubCategory.map(
//         (item) => new RegExp(`^${item}$`, "i")
//       );
//       console.log("serchsub =>", serchsub);

//       let query = {
//         MaincategoryName: { $in: search },
//         subcategoryName: { $in: serchsub },
//       };

//       // const totalResults = await Product.countDocuments(query);
//       // const totalPages = Math.ceil(totalResults / limit);



//    const results = await Product.find(query);
//       // return res.json(results);
//       return res.json({
//         status: "success",
//         message: "Products retrieved successfully.",
//         result: results,

//       });
//     } else {
//       console.log("ELSE =>");

//       // Only subcategory name-wise search
//       const serchsub = availableSubCategory.map(
//         (item) => new RegExp(`^${item}$`, "i")
//       );

//       const query = {
//         subcategoryName: { $in: serchsub },
//       };


//       const results = await Product.find(query)



//       return res.json({
//         status: "success",
//         message: "Products retrieved successfully.",
//         result: results,

//       });
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.searchAllproduct = async (req, res) => {
  const searchTerm = req.query.q;
  // pagination
  const page = parseInt(req.params.page) || 1;

  const limit = parseInt(req.query.limit) || 16;


  const skip = (page - 1) * limit;
  const totalCategories = await Product.countDocuments();
  const totalPages = Math.ceil(totalCategories / limit);


  const modifiedSearchTerm = searchTerm.replace(
    /for/g,
    "for ".padStart("for ".length + 1)
  );


  try {
    // caetgeory
    const category = await Category.find();

    let categoryList = [];
    if (category.length) {
      categoryList = category.map((_ct) => _ct.MaincategoryName.toLowerCase());
    }

    const searchTermSplitted = modifiedSearchTerm
      .split(" ")
      .filter((term) => term)
      .map((term) => term.toLowerCase());

    const availableCategory = [];
    searchTermSplitted.forEach((_ct) => {
      const index = categoryList.indexOf(_ct);
      const indexSingular = categoryList.indexOf(pluralize.singular(_ct));
      const indexPlural = categoryList.indexOf(pluralize.plural(_ct));

      if (index >= 0) {
        !availableCategory.includes(categoryList[index]) &&
          availableCategory.push(categoryList[index]);
      }
      if (pluralize.isPlural(_ct) && indexSingular >= 0) {
        !availableCategory.includes(categoryList[indexSingular]) &&
          availableCategory.push(categoryList[indexSingular]);
      }
      if (pluralize.isSingular(_ct) && indexPlural >= 0) {
        !availableCategory.includes(categoryList[indexPlural]) &&
          availableCategory.push(categoryList[indexPlural]);
      }
    });

    // -------------------------------------------------------------------------------

    const query = {};
    if (_.size(availableCategory)) {
      let searchableMainCategory = availableCategory.map(
        (item) => new RegExp(`^${item}$`, "i")
      );
      console.log("searchableMainCategory =>", searchableMainCategory);

      query.mainCategoryName = { $in: searchableMainCategory };
    }
    console.log("query =>", query);

    const subcategory = await SubCategory.find(query);
    // console.log(' subcategory=>',subcategory);

    // subcategoey

    let subcategoryList = [];

    if (subcategory.length) {
      subcategoryList = subcategory.map((_st) =>
        _st.SubCateoryName.toLowerCase()
      );
    }

    console.log("subcategoryList =>", subcategoryList);
    const availableSubCategory = [];
    subcategoryList.forEach((_ct) => {
      if (modifiedSearchTerm.includes(_ct)) {
        !availableSubCategory.includes(_ct) && availableSubCategory.push(_ct);
      }
    });

    // -------------------------------------------------------------------------------
    if (availableCategory.length && availableSubCategory.length) {
      let search = availableCategory.map(
        (item) => new RegExp(`^${item}$`, "i")
      );
      let serchsub = availableSubCategory.map(
        (item) => new RegExp(`^${item}$`, "i")
      );
      console.log("serchsub =>", serchsub);

      let query = {
        MaincategoryName: { $in: search },
        subcategoryName: { $in: serchsub },
      };

      const results = await Product.find(query);
      // return res.json(results);
      return res.json({
        status: "success",
        message: "Products retrieved successfully.",
        result: results,
      });
    } else {
      console.log("ELSE =>");

      const results = await Product.find({
        $text: { $search: searchTerm },
      });
      // return res.json(results);
      return res.json({
        status: "success",
        message: "Products retrieved successfully.",
        result: results,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.allcatwiseProductdata = async (req, res) => {
  try {
    const { MaincategoryName } = req.body;

    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;

    // Make sure to replace 'Maincategory' with the actual field in your Product model
    const products = await Product.find({ MaincategoryName: MaincategoryName })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      MaincategoryName: MaincategoryName,
    });
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      status: "success",
      message: "data get successfully.",
      result: products,
      page: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//isme price asc and desc order me data nahi aarah he asc and desc me same data aa rah ahe
// exports.addProduct = catchAsync(async (req, res, next) => {
//   const data = req.body;
//   const { pName, price, details, discountPrice } = data;
//   const subCatId = req.params.id;

//   try {
//     const existingSubCategory = await SubCategory.findOne({ id: subCatId });
//     const existingCategory = await Category.findOne({ categoryName: existingSubCategory.MaincategoryName });

//     if (!existingSubCategory) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Subcategory not found.',
//       });
//     }

//     if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {

//       return res.status(400).json({
//         status: 'error',
//         message: 'Please upload at least one image.',
//       });
//     }

//     const uploadedImages = req.files;
//     console.log("uploadedImages",uploadedImages)

//     if (uploadedImages.length < 1 || uploadedImages.length > 5) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Please upload between 1 and 5 images.',
//       });
//     }

//     const addProductData = new Product({
//       subCategoryId: existingSubCategory.id,
//       pName: pName,
//       price: price,
//       details: details,
//       discountPrice: discountPrice,
//       subcategoryName: existingSubCategory.SubCateoryName,
//       MaincategoryName: existingCategory.MaincategoryName,
//     });

//     const imageFileNames = [];

//     // Iterate over the uploaded images and store their filenames
//     for (const image of uploadedImages) {
//       imageFileNames.push(image.filename);
//     }

//     addProductData.pImg = imageFileNames;

//     await addProductData.save();

//     res.json({
//       status: 'success',
//       message: 'Data Added successfully.',
//       result: addProductData,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// exports.updateProduct = catchAsync(async (req, res, next) => {
//   const productId = req.params.id;

//   const form = new formidable.IncomingForm();

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error parsing form data' });
//     }

//     try {

//       const details = Array.isArray(fields.details) ? fields.details.join(', ') : fields.details;
//       const discountPrice = Array.isArray(fields.discountPrice) ? fields.discountPrice.join(', ') : fields.discountPrice;
//       const subCategoryId = Array.isArray(fields.subCategoryId) ? fields.subCategoryId.join(', ') : fields.subCategoryId;

//       let pName = fields.pName;
//       let price = fields.price;

//       if (Array.isArray(pName)) {
//         pName = pName[0];
//       }
//       if (Array.isArray(price)) {
//         price = parseFloat(price[0]);
//       }

//       const pImgFiles = req.files; // Array of uploaded files
//       console.log(pImgFiles)
//       const pImg = pImgFiles.map((file) => file.path); // Array of file paths

//       const updatedProduct = await Product.findOneAndUpdate(
//         { _id: productId },
//         {
//           pName: pName,
//           price: price,
//           details: details,
//           discountPrice: discountPrice,
//           subCategoryId: subCategoryId,
//           pImg: pImg, // Store the array of file paths
//         },
//         { new: true } // To return the updated product
//       );

//       if (!updatedProduct) {
//         return res.status(404).json({ message: 'Product not found' });
//       }

//       res.status(200).json({ message: 'Product updated successfully', updatedProduct });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
// });

// exports.updateProduct = catchAsync(async (req, res, next) => {

//   const productId = req.params.id;

//   const form = new formidable.IncomingForm();

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error parsing form data' });
//     }

//     try {
//       const details = Array.isArray(fields.details) ? fields.details.join(', ') : fields.details;
//       const discountPrice = Array.isArray(fields.discountPrice) ? fields.discountPrice.join(', ') : fields.discountPrice;
//       const subCategoryId = Array.isArray(fields.subCategoryId) ? fields.subCategoryId.join(', ') : fields.subCategoryId;

//       let pName = fields.pName;
//       let price = fields.price;

//       if (Array.isArray(pName)) {
//         pName = pName[0];
//       }
//       if (Array.isArray(price)) {
//         price = parseFloat(price[0]);
//       }

//       // Check if files were uploaded
//       if (!req.files || req.files.length === 0) {
//         // No files were uploaded, update other fields and return
//         const updatedProduct = await Product.findOneAndUpdate(
//           { _id: productId },
//           {
//             pName: pName,
//             price: price,
//             details: details,
//             discountPrice: discountPrice,
//             subCategoryId: subCategoryId,
//           },
//           { new: true } // To return the updated product
//         );

//         if (!updatedProduct) {
//           return res.status(404).json({ message: 'Product not found' });
//         }

//         return res.status(200).json({ message: 'Product updated successfully', updatedProduct });
//       }

//       // If files were uploaded, proceed with mapping them
//       const pImgFiles = req.files;
//       const pImg = pImgFiles.map((file) => ({
//         data: fs.readFileSync(file.path), // Read the file data
//         type: file.type, // Set the file type
//       }));

//       const updatedProduct = await Product.findOneAndUpdate(
//         { _id: productId },
//         {
//           pName: pName,
//           price: price,
//           details: details,
//           discountPrice: discountPrice,
//           subCategoryId: subCategoryId,
//           pImg: pImg, // Store the array of file data and types
//         },
//         { new: true } // To return the updated product
//       );

//       if (!updatedProduct) {
//         return res.status(404).json({ message: 'Product not found' });
//       }

//       res.status(200).json({ message: 'Product updated successfully', updatedProduct });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
// });

// exports.updateProduct = catchAsync(async (req, res, next) => {
//   try {
//     const updateData = {
//       pName: req.body.pName,
//       price: req.body.price,
//       details: req.body.details,
//       discountPrice: req.body.discountPrice,
//       subcategoryName: req.body.subcategoryName,
//       MaincategoryName:req.body.MaincategoryName,
//       pImg: req.files.map(file => file.filename),
//       // pImg:[],//old code
//     };

//     //old code
//     // req.files.forEach((file) => {
//     //   updateData.pImg.push(file.filename);
//     // });

//     const update = await Product.findByIdAndUpdate(req.params.id, updateData);
//     console.log("update",update)

//     if (!update) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     const updatedProduct = await Product.findById(req.params.id).exec();

//     res.json(updatedProduct);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// exports.updateProduct = catchAsync(async (req, res, next) => {
//   try {

//     const updateData = {
//       pName: req.body.pName,
//       price: req.body.price,
//       details: req.body.details,
//       discountPrice: req.body.discountPrice,
//       subcategoryName: req.body.subcategoryName,
//       MaincategoryName: req.body.MaincategoryName,
//       pImg: req.files.map(file => file.filename),
//     };

//     if (req.files.length == 0 ) {

//       return res.status(400).json({
//         status: 'error',
//         message: 'Please upload at least one image.',
//       });
//     }

//     const update = await Product.findByIdAndUpdate(req.params.id, updateData);
//     console.log(update)

//     if (!update) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     const updatedProduct = await Product.findById(req.params.id).exec();

//     res.json(updatedProduct);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
