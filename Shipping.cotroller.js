const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Shipping = require('../Model/Shipping.Model')
const mongoose = require('mongoose');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')


// Function to send OTP via email using nodemailer
function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    // Configure your email service here
    // Example for Gmail:
    service: 'gmail',
    auth: {
      user: 'mailto:nidhivarniinfoteach@gmail.com',
      pass: 'gflpzmoakfgrpder',
    },
  });

  const mailOptions = {
    // from: 'mailto:varniinfosoft@gmail.com',
    from: `"hiya fashion👻" <${email}>`,
    to: email,
    subject: 'OTP Login',
    text: `Your OTP for login is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}



exports.addShipping = catchAsync(async (req, res, next) => {
  const data = req.body;
  const { Name, flatno, streetAddress, landmark, country, state, phoneno, email } = data;

  try {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(generatedOTP, 10);

    const otpCreatedAt = new Date(); // Save the timestamp when OTP is created

    await Shipping.findOneAndUpdate(
      { email },
      { $set: { email, otp: hashedOTP, otpCreatedAt } },
      { upsert: true, new: true }
    );

    sendOTPEmail(email, generatedOTP);

    // Continue with the shipping logic
    data.id = `USERSHP-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;
    data.cart = data.cart || {};
    data.cart.id = `USERSHP-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

    const user = await Shipping.create(data);

    res.json({
      status: 'success',
      message: `Shipping added successfully.`,
      result: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


exports.verifyotpData = async (req, res) => {
  const { email, otp } = req.body;
  console.log(' req.body=>', req.body);

  try {
    const user = await Shipping.findOne({ email }).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const expirationTime = 1 * 60 * 1000;
    console.log('expirationTime =>', expirationTime);

    const currentTime = new Date();
    console.log('currentTime =>', currentTime);

    if (!user.otpCreatedAt || !(user.otpCreatedAt instanceof Date)) {
      return res.status(500).json({ error: 'Invalid OTP creation time' });
    }

    const otpCreationTime = new Date(user.otpCreatedAt);
    const elapsedTime = currentTime - otpCreationTime;

    if (elapsedTime > expirationTime) {
      return res.status(401).json({ error: 'OTP has expired' });
    }

    console.log('otp =>', otp);
    console.log('user.otp =>', user.otp);

    const isOTPValid = bcrypt.compareSync(otp, user.otp);
    console.log('isOTPValid =>', isOTPValid);

    if (isOTPValid) {
      console.log('isOTPValid!! =>', isOTPValid);
      return res.status(200).json({ message: 'OTP verification successful' });
    } else {
      console.log('Invalid OTP =>', 'Invalid OTP');
      return res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.resendotp = async (req, res) => {
  const { email } = req.body;

  try {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(generatedOTP, 10);

    const otpCreatedAt = new Date(); // Save the timestamp when OTP is created

    await Shipping.findOneAndUpdate(
      { email },
      { $set: { email, otp: hashedOTP, otpCreatedAt } },
      { upsert: true, new: true }
    );

    sendOTPEmail(email, generatedOTP);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateShipping = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
console.log('data =>',data);


  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'No ID is provided!!',
    });
  }

  if (!data.Name || !data.city || !data.streetAddress || !data.state || !data.phoneNo || !data.email || !data.city) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields are required.',
    });
  }

  if (data.phoneNo.length > 10) {
    return res.status(400).json({
      status: 'error',
      message: 'Phone number should not have more than 10 digits.',
    });
  }

  const updatedShipping = await Shipping.updateOne({ id }, { $set: data });

  res.json({
    status: 'success',
    message: 'Shipping updated successfully.',
    result: updatedShipping,
  });
});

exports.deleteShippping = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new Error('No id is provided!!'));
  }
  const deleteData = await Shipping.findOneAndDelete({ _id: id });

  if (!deleteData) {
    return next(new Error('No product found with the provided id.', 404));
  }

  res.json({
    msg: 'delete successful!!',
    status: 'success',
    result: deleteData
  });

})

exports.getShipping = catchAsync(async (req, res, next) => {

  const category = await Shipping.find()

  res.json({
    status: 'success',
    message: 'Category get successfully.',
    result: category,

  });
})