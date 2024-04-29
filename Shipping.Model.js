const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const { sendOTPEmail } = require('../utils/nodemainler');

const shippingSchema = new Schema({
    id: {
        type: String,
        required: true,
        default: `USERSHP-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,

        immutable: true
    },
    Name: {
        type: String,

    },
    flatno: {
        type: String,
    },
    streetAddress: {
        type: String
    },
    landmark: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    phoneno: {
        type: String
    },
    email: {
        type: String
    },

    otp: {
        type: String,

        index: true

    },
    otpCreatedAt: { type: Date, default: Date.now },
    productData: [],

}, { timestamps: true });


// Hook to generate and save OTP before saving user
// shippingSchema.pre('save', async function (next) {
//     const user = this;

//     // Generate OTP
//     const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  
//     // Hash and save OTP
//     const hashedOTP = await bcrypt.hash(generatedOTP, 10);
//     user.otp = hashedOTP;
  
//     // Save OTP creation time
//     user.otpCreatedAt = new Date();
  
//     // Send OTP via email
//     sendOTPEmail(user.email, generatedOTP);
  
//     next();
// });


const Shipping = mongoose.model('shipping', shippingSchema);

module.exports = Shipping;