const router = require('express').Router();
const {mainCategoryName,getCategoryName,deleteCategoryData,deleteByCatId,searchCategory,
    updateMaincategory,uploadImage,uploadImageedit} =  require('../Cotroller/MainCategory.controller')

router.post('/addcategory', uploadImage, mainCategoryName);
router.get('/getcategory/:page', getCategoryName);
// router.delete('/deleteategory/:id',deleteCategoryData), 
router.delete('/deleteByCatId/:id', deleteByCatId)
router.patch('/updatecategory/:id',uploadImageedit,updateMaincategory);
// router.get('/searchcategory/:q(*)',searchCategory)
router.get('/searchcategory', searchCategory);





module.exports = router;    

