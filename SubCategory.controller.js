const mongoose = require('mongoose');
const MainCategory = require('../Model/MainCategory.model');
const SubCategory = require('../Model/SubCategory.model');
const Product = require('../Model/Product.model')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');

// exports.addSubategoryName = catchAsync(async (req, res, next) => {
//     const data = req.body
//     const { SubCateoryName } = data;
//     const catid = req.params.id;

//     const mainCategory = await MainCategory.findOne({ id: catid });

//     if (!mainCategory) {
//         return res.json({
//             status: 'fail',
//             message: 'Main Category not found.',
//         });
//     }

//     if (!SubCateoryName) {
//         return res.json({
//             status: 'fail',
//             message: 'Sub Category is required.',
//         });
//     }

//     // Check if a subcategory with the same name already exists within the main category
//     const existingSubcategory = await SubCategory.findOne({
//         SubCateoryName,
//         mainCategoryId: mainCategory.id,
//     });

//     if (existingSubcategory) {
//         return res.json({
//             status: 'fail',
//             message: 'Sub Category with the same name already exists in this Main Category.',
//         });
//     }

//     data.id = `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;
//     data.cart = data.cart || {};
//     data.cart.id = `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

//     const subCategory = new SubCategory({ SubCateoryName, mainCategoryId: mainCategory.id });

//     await subCategory.save();

//     res.json({
//         status: 'success',
//         message: 'Sub Category added successfully.',
//         result: subCategory,
//     });
// });

// exports.addSubategoryName = catchAsync(async (req, res, next) => {
//     const data = req.body;
//     const { SubCateoryName } = data;
//     const catid = req.params.id;

//     const mainCategory = await MainCategory.findOne({ id: catid });

//     if (!mainCategory) {
//         return res.json({
//             status: 'fail',
//             message: 'Main Category not found.',
//         });
//     }

//     if (!SubCateoryName) {
//         return res.json({
//             status: 'fail',
//             message: 'Sub Category is required.',
//         });
//     }

//     const existingSubCategory = await SubCategory.findOne({ SubCateoryName: SubCateoryName });
// if (existingSubCategory) {
//     return res.json({
//         status: 'fail',
//         message: 'Sub Category with this name already exists.',
//     });
// }



//     // const id = `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

//     data.id = catid;

//     const subCategory = new SubCategory({ ...data, mainCategoryId: mainCategory.id });

//     await subCategory.save();

//     res.json({
//         status: 'success',
//         message: 'Sub Category added successfully.',
//         result: subCategory,
//     });
// });

//add storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         const filename = file.originalname;
//         cb(null, filename);
//     },
// });

// const upload = multer({ storage: storage });

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

const uploadFields = [
    { name: 'subCatImg', maxCount: 1 },
    { name: 'sizeImg', maxCount: 1 },
];

exports.uploadImages = upload.fields(uploadFields);


// Edit storage
const storageedit = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const filename = file.originalname;
        cb(null, filename);
    },
});

const uploadimg = multer({ storage: storageedit });

const uploadFieldsConfig = [
    { name: 'subCatImg', maxCount: 1 },
    { name: 'sizeImg', maxCount: 1 },
];

exports.uploadeditImgs = uploadimg.fields(uploadFieldsConfig);



exports.addSubategoryName = catchAsync(async (req, res, next) => {
    const data = req.body;
    const { SubCateoryName, mainCategoryName } = data;
    console.log(data)


    const existingSubCategory = await SubCategory.findOne({
        SubCateoryName,
        mainCategoryName

    });

    if (existingSubCategory) {
        return res.json({
            status: 'fail',
            message: 'Sub Category with this name already exists in the main category.66',
        });
    }

    if (!SubCateoryName) {
        return res.json({
            status: 'fail',
            message: 'Sub Category is required.',
        });
    }
    // console.log(SubCateoryName)

    if (!req.files || !req.files['subCatImg']) {
        return res.status(400).json({
            status: 'fail',
            message: 'Both subCatImg and sizeImg are required.',
        });
    }

    data.subCatImg = req.files['subCatImg'][0].filename;
    data.sizeImg = req.files['sizeImg'][0].filename;
    data.id = `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;
    data.cart = data.cart || {};
    data.cart.id = `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;


    const subCategory = new SubCategory({
        ...data,

    });


    await subCategory.save();

    res.json({
        status: 'success',
        message: 'Sub Category added successfully.',
        result: subCategory,
    });
});

exports.updateSubCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log('id =>', id);

    const data = req.body;

    if (!id) {
        return next(new Error('No ID is provided!!'));
    }

    const { mainCategoryName, SubCateoryName } = data;

    try {
        const existingSubCategory = await SubCategory.findOne({ id: id });

        if (!existingSubCategory) {
            return res.status(404).json({
                status: 'fail',
                message: 'No subcategory found with the provided ID.',
            });
        }

        if (SubCateoryName && SubCateoryName !== existingSubCategory.SubCateoryName && mainCategoryName && mainCategoryName !== existingSubCategory.mainCategoryName) {
            const duplicateSubCategory = await SubCategory.findOne({ SubCateoryName, mainCategoryName });

            if (duplicateSubCategory) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Sub Category with this name already exists.',
                });
            }
        }

        const updateFields = {
            mainCategoryName: mainCategoryName || existingSubCategory.mainCategoryName,
            SubCateoryName: SubCateoryName || existingSubCategory.SubCateoryName,
        };

        if (req.files['subCatImg']) {
            updateFields.subCatImg = req.files['subCatImg'][0].filename;
        }

        if (req.files['sizeImg']) {
            updateFields.sizeImg = req.files['sizeImg'][0].filename;
        }

        const updatedSubCategory = await SubCategory.findOneAndUpdate(
            { id: id },
            updateFields,
            { new: true, runValidators: true }
        );

        res.json({
            status: 'success',
            message: 'SubCategory updated successfully!!',
            result: updatedSubCategory,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while processing your request.',
        });
    }
});

exports.getSubCategoryName = catchAsync(async (req, res, next) => {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const totalCategories = await SubCategory.countDocuments();

    const totalPages = Math.ceil(totalCategories / limit);

    const category = await SubCategory.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);


    res.json({
        status: 'success',
        message: 'Sub Category get successfully.',
        result: category,
        page: page,
        totalPages: totalPages
    });
})

// dahsboard api 
exports.subcategorydashboardCount = async (req, res, next) => {
    try {
        const subcategoryCounts = await Product.aggregate([
          { $group: { _id: '$subcategoryName', count: { $sum: 1 } } }
        ]);
      
        const subcategoryCountArray = subcategoryCounts.map(item => ({
          subcategoryName: item._id,
          count: item.count
        }));
      
        const  Maincategory = await  MainCategory.count();
        console.log(' Maincategory=>',Maincategory);
        
        const  subcatgory = await  SubCategory.count();
        console.log(' Maincategory=>',subcatgory);
        
        const  product = await  Product.count();
        console.log(' Maincategory=>',product);

        res.status(200).json({
          status: 'success',
          data: {
            subcategoryCount: subcategoryCountArray,
            category:Maincategory,
            subcatgory:subcatgory,
            product:product
          }

        });
      } catch (err) {
        res.status(500).json({
          status: 'error',
          message: err.message
        });
      }
      
  };

exports.geAllCategoryName = catchAsync(async (req, res, next) => {
    const category = await MainCategory.find();
    const subcategory = await SubCategory.find();


    res.json({
        staus: 'success',
        message: 'Category get Succefully.',
        category: category,
        subCategory: subcategory
    });
})


exports.subcatgeorywisedatacount = catchAsync(async (req, res, next) => {
    const { subcategoryName } = req.params;
    console.log('subcategoryName =>', subcategoryName);

    let aggregationPipeline = [];

    if (subcategoryName) {
        aggregationPipeline.push({
            $match: { subcategoryName }
        });
    }

    aggregationPipeline.push({
        $group: {
            _id: null,
            count: { $sum: 1 }
        }
    });

    const result = await Product.aggregate(aggregationPipeline);

    const count = result.length > 0 ? result[0].count : 0;

    if (!subcategoryName) {
        const totalCount = await Product.countDocuments();
        console.log(totalCount);
    }

    res.status(200).json({
        status: 'success',
        data: {
            count
        }
    });
});

exports.mainCategorycount = catchAsync(async(req,res,next)=>{
    const { MaincategoryName } = req.params;
    console.log('MaincategoryName =>', MaincategoryName);

    let aggregationPipeline = [];

    if (MaincategoryName) {
        aggregationPipeline.push({
            $match: { MaincategoryName }
        });
    }

    aggregationPipeline.push({
        $group: {
            _id: null,
            count: { $sum: 1 }
        }
    });

    const result = await Product.aggregate(aggregationPipeline);

    const count = result.length > 0 ? result[0].count : 0;

    if (!MaincategoryName) {
        const totalCount = await Product.countDocuments();
        console.log(totalCount);
    }

    res.status(200).json({
        status: 'success',
        data: {
            count
        }
    });

})


exports.deletesubCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new Error('No id is provided!!'));
    }
    const deleteData = await SubCategory.findOneAndDelete({ _id: id });

    if (!deleteData) {
        return next(new Error('No product found with the provided id.', 404));
    }

    res.json({
        msg: 'delete successful!!',
        status: 'success',
        result: deleteData
    });
});


exports.subcategoryWiseGetData = catchAsync(async (req, res, next) => {
    const mainCategoryName = req.body.mainCategoryName;
    try {
        const subcategories = await SubCategory.find({ mainCategoryName });

        if (subcategories.length === 0) {
            return res.status(404).json({ message: 'No subcategories found for the given main category name.' });
        }

        res.status(200).json({
            status: 'success',
            data: subcategories,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});



exports.homeSubcategoryPrint = catchAsync(async (req, res, next) => {
    const subCategoryName = req.body.subcategoryName;
    console.log(subCategoryName);
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) ;
    const skip = (page - 1) * limit;

    try {
        const products = await Product.find({ subcategoryName: subCategoryName }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the given subcategory.' });
        }

        const totalProducts = await Product.countDocuments({ subcategoryName: subCategoryName });
        const totalPages = Math.ceil(totalProducts / limit);
        console.log(totalPages);

        res.status(200).json({
            status: 'success',
            result: products,
            page: page,
            totalPages: totalPages
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});


exports.categoryWiseSubcategoryData = catchAsync(async (req, res, next) => {
    const mainCategoryName = req.body.MaincategoryName;


    const mainCategory = await MainCategory.findOne({ MaincategoryName: mainCategoryName });
    console.log({ mainCategory })
    if (!mainCategory) {
        return res.status(404).json({ message: 'Main category not found' });
    }

    const subcategories = await SubCategory.find({ mainCategoryName: mainCategory.MaincategoryName });

    res.status(200).json({
        status: 'success',
        data: subcategories,

    });
})
// homeSubcategoryPrint home thi shop page ma data ave
// me jo maincategoryName and SubcatgeoryName   add karu usk muje product get karni he
exports.productsBySubCategory = catchAsync(async (req, res, next) => {
    const { mainCategoryName, subCategoryName } = req.body;

    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) ;
    const skip = (page - 1) * limit;

    // Validate that both mainCategoryName and subCategoryName are present
    if (!mainCategoryName || !subCategoryName) {
        return res.status(400).json({ error: 'Both mainCategoryName and subCategoryName are required.' });
    }

    try {
        // Query the database to get products based on mainCategoryName and subCategoryName with pagination
        const products = await Product.find({
            MaincategoryName: mainCategoryName,
            subcategoryName: subCategoryName,
        }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get the total number of products for the specified mainCategoryName and subCategoryName
        const totalProducts = await Product.countDocuments({
            MaincategoryName: mainCategoryName,
            subcategoryName: subCategoryName,
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalProducts / limit);

        // Respond with the list of products and total pages
        res.json({
            status: 'success',
            message: 'subcategorywise product data get successfully.',
            result: products,
            page: page,
            totalPages: totalPages
        });
    } catch (error) {
        // Handle any errors that might occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.productsBypageRefresh = catchAsync(async (req, res, next) => {
    const { mainCategoryName, subCategoryName } = req.params;

    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;

    // Validate that both mainCategoryName and subCategoryName are present
    if (!mainCategoryName || !subCategoryName) {
        return res.status(400).json({ error: 'Both mainCategoryName and subCategoryName are required.' });
    }

    try {
        // Query the database to get products based on mainCategoryName and subCategoryName with pagination
        const products = await Product.find({
            MaincategoryName: mainCategoryName,
            subcategoryName: subCategoryName,
        }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get the total number of products for the specified mainCategoryName and subCategoryName
        const totalProducts = await Product.countDocuments({
            MaincategoryName: mainCategoryName,
            subcategoryName: subCategoryName,
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalProducts / limit);

        // Respond with the list of products and total pages
        res.json({
            status: 'success',
            message: 'page refresh subcategorywise product data get successfully.',
            result: products,
            page: page,
            totalPages: totalPages
        });
    } catch (error) {
        // Handle any errors that might occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

exports.catgeoryWiseProductData = catchAsync(async (req, res, next) => {
    const { MaincategoryName } = req.params;
    console.log('MaincategoryName =>', MaincategoryName);

    if (!MaincategoryName) {
        return res.status(400).json({
            status: 'fail',
            message: 'Category name is required.'
        });
    }

    try {
        const products = await Product.find({ MaincategoryName: MaincategoryName });
        console.log('products =>', products);

        res.status(200).json({
            status: 'success',
            data: {
                products
            }
        });
    } catch (error) {
        console.error('Error fetching category-wise product data:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});


exports.allsubCategoryget = catchAsync(async (req, res, next) => {

    const page = req.body.page || 1;

    const category = await SubCategory.find().skip((page - 1) * 10)
        .exec();

    if (category.length === 0) {
        return res.status(404).json({ message: 'No subcategories found for the given main category name.' });
    }

    res.json({
        status: 'success',
        message: 'Sub Category get successfully.',
        result: category,

    });
})

// exports.updateSubCategory = catchAsync(async (req, res, next) => {
//     const { id } = req.params;


//     const data = req.body;


//     if (!id) {
//         return next(new Error('No ID is provided!!'));
//     }



//     // Extract MaincategoryName and SubCateoryName from the data object
//     const { mainCategoryName, SubCateoryName } = data;

//     try {
//         // Check if a subcategory with the provided ID exists
//         const existingSubCategory = await SubCategory.findOne({ id: id });

//         if (!existingSubCategory) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'No subcategory found with the provided ID.',
//             });
//         }

//         // Check if SubCateoryName is being changed and if it will cause a duplicate key error
//         if (SubCateoryName && SubCateoryName !== existingSubCategory.SubCateoryName) {
//             // Check for existing documents with the new SubCateoryName
//             const duplicateSubCategory = await SubCategory.findOne({ SubCateoryName: SubCateoryName });

//             if (duplicateSubCategory) {
//                 return res.status(400).json({
//                     status: 'fail',
//                     message: 'Sub Category with this name already exists.',
//                 });
//             }
//         }

//         // Update the subcategory
//         const updatedSubCategory = await SubCategory.findOneAndUpdate(
//             { id: id },
//             {
//                 mainCategoryName: mainCategoryName || existingSubCategory.mainCategoryName,
//                 SubCateoryName: SubCateoryName || existingSubCategory.SubCateoryName,
//             },
//             { new: true, runValidators: true }
//         );

//         res.json({
//             status: 'success',
//             message: 'SubCategory updated successfully!!',
//             result: updatedSubCategory,
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while processing your request.',
//         });
//     }
// });





// exports.searchSubCategory = catchAsync(async (req, res, next) => {
//         try {


//         const searchQueryName = req.query.SubCateoryName;
//         //   SubCateoryName: { $regex: new RegExp(searchQueryName, 'i') }, ye line add akarni he 188 : pachi maultiplae search mate 
//         if (searchQueryName) {
//             const categories = await SubCategory.find({
//             SubCateoryName: searchQueryName,
//             });

//             res.status(200).json(categories);
//         } else {
//             res.status(400).json({ message: 'Invalid search parameters' });
//         }
//         } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//         }
// });


exports.searchSubCategory = catchAsync(async (req, res, next) => {
    // try {
    //     const { subCategoryName, mainCategoryName } = req.query;
    //     console.log(subCategoryName, mainCategoryName)

    //     let query = {};
    //     if (subCategoryName && mainCategoryName) {
    //         query = {
    //             subCategoryName: { $regex: new RegExp(`^${subCategoryName}$`) },
    //             mainCategoryName: { $regex: new RegExp(`^${mainCategoryName}$`) },
    //         };
    //     } else {
    //         if (subCategoryName) {
    //             query.subCategoryName = { $regex: new RegExp(`^${subCategoryName}$`) };
    //         }
    //         if (mainCategoryName) {
    //             query.mainCategoryName = { $regex: new RegExp(`^${mainCategoryName}^`) };
    //         }
    //     }

    //     const products = await SubCategory.find(query);

    //     if (products.length > 0) {
    //         return res.status(200).json(products);
    //     } else {
    //         return res.status(404).json({ message: 'Data not Found.' });
    //     }
    // } catch (error) {
    //     console.error('Error:', error);
    //     res.status(500).json({ message: 'Internal Server Error' });
    // }

    try {
        const { SubCateoryName, mainCategoryName } = req.query;

        let query = {};
        console.log(query);


        if (SubCateoryName) {
            query.SubCateoryName = SubCateoryName; // Exact match for subcategory name
        }

        if (mainCategoryName) {
            query.mainCategoryName = mainCategoryName; // Exact match for main category name
        }


        const products = await SubCategory.find(query);
        if (products.length > 0) {
            return res.status(200).json(products);
        } else {
            return res.status(404).json({ message: 'Data not Found .' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

});


exports.allDataCounter = catchAsync(async (req, res, next) => {
    try {
        const totalSubcategories = await SubCategory.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCategories = await MainCategory.countDocuments()

        res.json({
            status: 'success',
            message: 'Data counts retrieved successfully.',
            totalSubcategories,
            totalProducts,
            totalCategories
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
