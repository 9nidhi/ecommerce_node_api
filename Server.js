require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const cors = require('cors');
const bodyParser = require('body-parser');


const addCategoryRoutes = require('./Routes/MainCategory.routes');
const subCategoryRoutes = require('./Routes/SubCategory.routes');
const addProductRoutes = require('./Routes/product.routes');
const userRoutes = require('./Routes/UserData.routes');
const paymentRoutes = require('./Routes/Payment.routes');
const bannerRotes = require('./Routes/Banner.routes');
const bannerProductRotes = require('./Routes/BannerProduct.routes')
const shippingRoutes = require('./Routes/Shipping.routes')
const loginRoutes = require('./Routes/Login.routes')
const cartRoutes = require('./Routes/Cartroutes')
const amountsetupRoutes = require('./Routes/AmountSet.routes')
const formdataRoutees =require('./Routes/luckFormdata.routes')
// const phonepeRoutes = require('./Routes/phonepe.routes')
// const { authCheck } = require('./middleware/auth.middleware');

const Database_Url = process.env.Database_Url ||'mongodb+srv://varniinfosoft:tMIPCNAFPNq8ynXa@cluster0.bcnhd3q.mongodb.net/ecommerce';

const PORT = process.env.PORT || 4800;

mongoose.connect(Database_Url, { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log("connected to the database"))
  .catch((err) => console.log(err.message));

const app = express();

app.use("/public", express.static(__dirname + "/public"))
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());
app.use('/api/v1/uploads', express.static('uploads'));

app.use(cors({
  withCredentials: true,
  origin: ['*', 'http://localhost:3000','http://localhost:3001','http://localhost:3002','http://193.203.162.218:5000','  http://localhost:5173']
}));

// app.get('/', authCheck, (req, res) => {
// 	res.json({
// 		status: 'success',
// 		message: `Authorised.`,
// 		data: req.user
// 	});
// });

app.use('/api/v1', addCategoryRoutes);
app.use('/api/v1', subCategoryRoutes);
app.use('/api/v1', addProductRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1',bannerRotes)
app.use('/api/v1',bannerProductRotes)
app.use('/api/v1',paymentRoutes)
app.use('/api/v1',shippingRoutes)
app.use('/api/v1',loginRoutes)
app.use('/api/v1',cartRoutes)
app.use('/api/v1',amountsetupRoutes)
app.use('/api/v1',formdataRoutees)
// app.use('/api/v1',phonepeRoutes)


// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
// });


app.all('*', (req, res) => {
	res.json({
		status: 'fail',
		message: `No route matches with ${req.url}.`,
		data: null
	});
});


app.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

// $encryptedData = "0TvGwcBQe5saMgx6PZKMx4oX/xZwRPOJrf57C+UaeXIB495cyEDBjuj+w1sdH6UuRA5KVyvAtCrhOtZvw1pK1aURsoHB/jioaPDtdWzvOyE";

// $cipher = "AES-128-ECB";
// // Key
// $key = "18d8a749fee26b35129ed6c69255479e";
// $iv = ''; 
// echo $iv;
// $ecpt = openssl_encrypt($encryptedData, $cipher, $key, 0, $iv ); 
// echo $ecpt . "<br>";

// echo openssl_decrypt($ecpt , $cipher, $key, 0, $iv ); 