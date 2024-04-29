const router = require("express").Router();
const { update } = require("lodash");
const { addShipping,updateShipping,getShipping,resendotp,deleteShippping,verifyotpData} = require("../Cotroller/Shipping.cotroller");

// const { authCheck } = require("../middlewares/auth.middleware");


router.post('/addshipping', addShipping);
router.patch('/updateshipping/:id',updateShipping)
router.delete('/deleteshipping/:id',deleteShippping)
router.get('/getshipping',getShipping)
router.post('/verifyotpdata', verifyotpData);
router.post('/resendotp', resendotp);

module.exports = router;