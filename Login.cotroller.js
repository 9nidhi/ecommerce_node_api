const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Users = require('../Model/Login.modal')
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
      user: 'nidhivarniinfoteach@gmail.com',
      pass: 'zgdxgvvoshnmilbi',
    },
  });

  const mailOptions = {
    // from: 'varniinfosoft@gmail.com',
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

exports.loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP and hash it
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(generatedOTP, 10);

    // Save OTP and email in the database
    await Users.findOneAndUpdate(
      { email },
      { $set: { email, otp: hashedOTP } },
      { upsert: true, new: true }
    );

    // Send OTP via email
    sendOTPEmail(email, generatedOTP);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.verifyotp = async (req, res) => {
 const { email, enteredOTP } = req.body;

  try {
    // Retrieve hashed OTP from the database
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare entered OTP with the hashed OTP from the database
    const isOTPValid = await bcrypt.compare(enteredOTP, user.otp);

    if (isOTPValid) {
      // If OTP is valid, you can perform further actions (e.g., log the user in)
      return res.status(200).json({ message: 'OTP verification successful' });
    } else {
      return res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}