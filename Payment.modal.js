const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const paymentSchema = new Schema({

    payerName: {
        type: String,
    },
    payerEmail: {
        type: String
    },
    payerMobile: {
        type: String
    },
    amount: { type: String },
    payerAddress: {
        type: String
    },
    clientCode:{
        type:String
    },
    transUserName:{
        type:String
    },
    transUserPassword:{
        type:String
    },
    amountType:{
        type:String
    },
    env:{
        type:String,
        default:"prod"
    }

}, { timestamps: true });



const Payment = mongoose.model('payment', paymentSchema)

module.exports = Payment;