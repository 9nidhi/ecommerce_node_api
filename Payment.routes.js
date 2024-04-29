const router = require("express").Router();
const {getPayment,addPPayment,pgresponse,addPayment} = require("../Cotroller/Payment.controller");

router.get('/payment-get',getPayment)
router.post('/payment-post',addPayment)
router.get('/pgresponse',(req,res)=>{
    console.log('GETTTT =>',);
    
    const { channelId } = req.query;
    // Handle the request here, e.g., process channelId
    res.send(`Received pgresponse request with channelId: ${channelId}`);
    
})
router.post('/pgresponse',pgresponse)
router.post('/payment-postt',addPPayment)

module.exports = router;