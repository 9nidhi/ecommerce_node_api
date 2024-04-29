const router = require('express').Router();
const {addSubategoryName,productsBypageRefresh,subcategorydashboardCount,mainCategorycount,catgeoryWiseProductData,subcatgeorywisedatacount,uploadImages,allsubCategoryget,uploadeditImgs,homeSubcategoryPrint,productsBySubCategory,getSubCategoryName,categoryWiseSubcategoryData,subcategoryWiseGetData,geAllCategoryName,deletesubCategory,allDataCounter,searchSubCategory,updateSubCategory} =  require('../Cotroller/SubCategory.controller')

router.post('/addSubcategory/:id', uploadImages,addSubategoryName);
router.get('/getsubcategory/:page', getSubCategoryName);
router.get('/getallcategory', geAllCategoryName);
router.delete('/deletesubcategory/:id',deletesubCategory);
router.patch('/updatesubcategiry/:id',uploadeditImgs,updateSubCategory)
router.get('/searchsubcategory',searchSubCategory);
router.get('/alldatacount',allDataCounter)
// router.get('/searchsubcategory', searchSubCategory);
router.post ('/subcategoryWiseGetData',subcategoryWiseGetData)
router.post('/categorywiseSubcategory',categoryWiseSubcategoryData)
router.post('/allSubacategoey',allsubCategoryget)
router.post('/subCategoryNamewiseProduct', productsBySubCategory);
// router.post('/subCategoryNamewiseProduct/:page', productsBySubCategory);
// router.post('/homeSubcategoryPrint/:page', homeSubcategoryPrint);
router.post('/homeSubcategoryPrint', homeSubcategoryPrint);
router.get('/subcategorydashboardCount', subcategorydashboardCount);
router.get('/subcatgeorywisedatacount/:subcategoryName?', subcatgeorywisedatacount);
router.get('/mainCategorycount/:MaincategoryName?', mainCategorycount);
router.get('/pagerefreshwiseproductget/:page/:mainCategoryName/:subCategoryName',productsBypageRefresh);
router.get('/getSubcategoryGetdata/:MaincategoryName',catgeoryWiseProductData)
    

module.exports = router;    

 
