require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const _ = require('lodash');
const LoginForm = require('../Model/Login.model');
const JWT_SECRET = "mysecret212313333"
const admin = require('firebase-admin');
const { parse, format, isValidNumber } = require('libphonenumber-js');
const serviceAccount = require('../otp_API_Key/otp-send-hiyafashion-firebase-adminsdk-vv0q0-6618a98bbb.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

exports.LoginForm = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneno;

        const parsedPhoneNumber = parse(phoneNumber, 'IN');

        if (!isValidNumber(parsedPhoneNumber)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid phone number format.',
            });
        }

        const formattedPhoneNumber = format(parsedPhoneNumber, 'E.164');

        let user = await admin.auth().getUserByPhoneNumber(formattedPhoneNumber)
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    return admin.auth().createUser({
                        phoneNumber: formattedPhoneNumber,
                    }); 
                }
                throw error;
            });

        const token = await admin.auth().createCustomToken(user.uid);

        res.json({
            status: 'success',
            message: 'User logged in or registered successfully',
            user: {
                uid: user.uid,
                phoneNumber: user.phoneNumber,
            },
            token: token,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 'fail',
            message: 'Error logging in or registering user',
        });
    }
}