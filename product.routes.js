    const router = require('express').Router();
    const {Allproduct, addProduct,addTocart, uploadImage,searchAllproduct,allcatwiseProductdata, getAllProduct,uploadImageUpdate,sortingproduct,allcatWiseProduct,deleteProduct,updateProduct,searchProduct } = require('../Cotroller/Product.cotroller')
    const bodyParser = require('body-parser');
    const jsonParser = bodyParser.json();
    const urlencodedParser = bodyParser.urlencoded({ extended: false });

    router.post('/addProduct/:id', uploadImage, addProduct);
    router.get('/getAllProduct/:page', getAllProduct)
    router.get('/getAllProductNotPage', getAllProduct)
    router.delete('/deleteproduct/:_id', deleteProduct)
    router.patch('/updateproduct/:id',uploadImageUpdate,updateProduct)
    router.get('/searchproduct',searchProduct)
    router.get('/allCatWiseProduct',allcatWiseProduct)
    router.get('/sortingProduct/:subcategoryName',sortingproduct)
    router.get('/serchallproduct',searchAllproduct)
    router.get('/allproduct/:page', Allproduct);
    router.post('/allcatwiseProductdata/:page', allcatwiseProductdata)
    router.post('/addToCart',addTocart)


    module.exports = router;        