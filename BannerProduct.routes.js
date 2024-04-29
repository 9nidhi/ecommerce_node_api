const router = require('express').Router();
const { banneraddProduct, uploadImage, getBannerAllProduct,uploadImageUpdate,allcatWiseProduct,deleteBannerProduct,updateBannerproduct,searchProduct } = require('../Cotroller/BannerProduct.controller')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/banneraddProduct/:id', uploadImage, banneraddProduct);
router.get('/getBannerAllProduct/:page', getBannerAllProduct)
router.delete('/deleteBannerProduct/:_id', deleteBannerProduct)
router.patch('/updateBannerproduct/:id',uploadImageUpdate,updateBannerproduct)
// router.get('/searchproduct',searchProduct)
// router.get('/allCatWiseProduct',allcatWiseProduct)

module.exports = router;        

