const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const _ = require('lodash');

const loginuserSchema = new Schema({
    email : {
        type : String,
        required : true
    } ,
    otp  : {
        type: String,
        required: true,
       
    },
    otpCreatedAt: {
        type: Date,
        required: true,
      },
}, {timestamps: true});

// Hook to generate and save OTP before saving user
loginuserSchema.pre('save', async function (next) {
    const user = this;
  
    // Generate OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  
    // Hash and save OTP
    const hashedOTP = await bcrypt.hash(generatedOTP, 10);
    user.otp = hashedOTP;
  
    // Send OTP via email
    sendOTPEmail(user.email, generatedOTP);
  
    next();
  });

const Login = mongoose.model('login', loginuserSchema);

module.exports = Login;