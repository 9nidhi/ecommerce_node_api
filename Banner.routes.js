// routes.js
const express = require('express');
const router = express.Router();
const {addBanner,uploadImage,getBanner,deletemeBanner,edituploadImage,editBanner} =  require('../Cotroller/Banner.cotroller');

router.post('/addbanner/:id',  uploadImage, addBanner);
router.get('/getbanner',getBanner);
router.delete('/deletebanner/:id',deletemeBanner);
router.patch('/editbanner/:id', edituploadImage,editBanner);

module.exports = router;


