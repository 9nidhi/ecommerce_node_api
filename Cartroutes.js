const router = require('express').Router();
const {addCart} =  require('../Cotroller/Cart.controller')

router.post('/cartadd', addCart);

module.exports = router;    

