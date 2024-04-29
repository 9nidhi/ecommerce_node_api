require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const _ = require('lodash');
const Users = require('../Model/UserData.modal');
const JWT_SECRET = "mysecret212313333"


exports.getUserByEmail = async (req, res) => {
    let user = await Users.find(req.body)
    if (user.length > 0) {
        res.send({
            status: "success",
            message: "User Get Successfully",
            result: user
        })
    } else {
        res.send({
            status: "fail",
            message: "No User Found",
            result: null
        })
    }
};


exports.addUser = async (req, res) => {
    try {
        let {username,password} = req.body;
       
        if(!username) username = undefined;
        if(!password) throw new Error("password is required.");
      
        const newUser = new Users({ username,password});
        const user = await newUser.save();

        res.json({
			status: 'success',
			message: `user added.`,
			data: user,
		});

    } catch (err) {
        let message;
        if (err.name === "MongoServerError" && err.code === 11000 && err.keyPattern.username) message =  "Username already exists. Please change username.";
        if (err.name === "MongoServerError" && err.code === 11000 && err.keyPattern.email) message =  "Email already exists. Please change email.";
        res.json({
			status: 'fail',
			message: message || err.message || 'Unknown error occur.',
			data: null,
		});
    }
};




exports.loginUsers = async (req, res) => {
    const {username, password} = req.body;
    
    try {
        if(!username)throw new Error("Enter username to login.");
        if(!password)throw new Error("Enter password to login.");

        const user = await Users.findOne({username}).select('+password');

        if(!user) throw new Error("Invalid credentials. Please check Username and Password");
     

        const valid = await bcrypt.compare(password, user?.password);
        if(!valid) throw new Error("Invalid credentials. Please check Username and Password");

        const token = jwt.sign({ _id: user.username }, JWT_SECRET, {expiresIn: "20d"});  //20 Days --- Same below for cookie

     

        user.password = undefined;

        res.json({
			status: 'success',
			message: 'User loggedin successfully.',
            login: true,
            token,
			data: user
		});

    } catch (err) {
        res.json({
			status: 'fail',
			message: err.message || "Unknown error occur.",
			data: null
		});
    }
}

exports.logoutUsers = async (req, res) => {
    const token = req.cookies.token;

    res.cookie("token", token, {
        expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 1000 -> 1sec -> *60 -> 1min -> *5 -> 5min 
    });

    try {
        const verify = await jwt.verify(token, JWT_SECRET);
        const username = verify._id;

        if(!username) throw new Error("No user found!");

        res.json({
			status: 'success',
			message: 'User logout successfully.',
			data: null
		});
    } catch (err) {
        res.json({
			status: 'fail',
			message: err.message || "Unknown error occur.",
			data: null
		});
    }

}