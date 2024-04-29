const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const _ = require('lodash');

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    } ,
    password : {
        type: String,
        required: true,
        select: false
    }
}, {timestamps: true});

//Middlare function for user hash and removing confirm password field
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    // this.confirmPassword = undefined;
});

const Users = mongoose.model('users', userSchema);

module.exports = Users;