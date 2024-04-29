const router = require("express").Router();
const { loginUser,verifyotp} = require("../Cotroller/Login.cotroller");

// const { authCheck } = require("../middlewares/auth.middleware");


router.post('/loginuser', loginUser);
router.post('/verifyotp', verifyotp);


module.exports = router;