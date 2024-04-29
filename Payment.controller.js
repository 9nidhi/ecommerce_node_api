const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
const crypto = require("crypto");
const CryptoJS = require('crypto-js');
const Payment = require('../Model/Payment.modal')
const sabpaisa = require("../utils/sabpaisa");

// const key = 'b6wcogQ8RX2V3rxR'; // Replace with your authentication key
// const iv = 'rT5lcnOUCMPxAzZG'; 

// get api
exports.getPayment = catchAsync(async (req, res, next) => {

});



// Constants for encryption
// const algorithm = "aes-256-cbc";
const authKey = "QVMtR1JBUy1QUk9E"; // Replace with your authentication key
const authIV = "1234567890123456"; // Replace with your initialization vector

// function encryptData(data, authKey, authIV) {
//     const encryptedData = CryptoJS.AES.encrypt(data, authKey, { authIV: authIV }).toString();
//     return encryptedData;
// }


const algorithm = "aes-128-cbc";
function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(authKey), authIV);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("base64");
}

function decryptData(encryptedData, authKey, authIV) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(authKey), authIV);
    let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
}



function randomStr(len, arr) {
    var ans = "";
    for (var i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

// 

exports.addPayment = catchAsync(async (req, res, next) => {
    const { payerName, payerEmail, payerMobile, payerAddress, amount, clientCode, transUserName, transUserPassword, callbackUrl, amountType } = req.body;

    // console.log('req.body =>', req.body);

    const randomClientTxnId = crypto.randomBytes(16).toString('hex');

    console.log('Client Code:', clientCode);

    // const callbackUrl="http://localhost:4800/api/v1/pgresponse&channelId=W";
    const dataString = `payerName=${payerName}&payerEmail=${payerEmail}&payerMobile=${payerMobile}&clientTxnId=${randomClientTxnId}&payerAddress=${payerAddress}&amount=${amount}&clientCode=${clientCode}&transUserName=${transUserName}&transUserPassword=${transUserPassword}&callbackUrl=${callbackUrl}&amountType=${amountType}&env=prod&mcc=555&transDate=${new Date()}&channelId=W`;
    console.log('dataString =>', dataString);
    // dataString+=`&callbackUrl${callbackUrl}`

    const encryptedData = encryptData(dataString, authKey, authIV);
    // console.log(' authKey, authIV=>', authKey, authIV);

    try {
        // let apiUrl = 'https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1'; // Default API URL
        let apiUrl = 'https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1'; // Default API URL


        const env = "prod"
        const response = await axios.post(apiUrl, {
            encData: encryptedData,
            iv: authIV
            // env

        });
        console.log('4th =>', clientCode);

        // console.log('response =>', response);

        const responseData = response.data;

        console.log('5th =>', clientCode);

        const result = await Payment.create({
            payerName,
            payerEmail,
            payerMobile,
            clientTxnId: randomClientTxnId,
            payerAddress,
            amount,
            clientCode,
            transUserName,
            transUserPassword,
            callbackUrl,
            amountType
        });
        console.log('result =>', result);

        console.log('6th =>', clientCode);

        res.status(200).json({
            status: 'success',
            message: 'Payment initiated successfully',
            data: {
                clientTxnId: randomClientTxnId,
                responseData: responseData
            }
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({
            status: 'error',
            message: 'Payment initiation failed'
        });
    }

});

// const decryptedStringForRequest = decryptData(encryptedStringForRequest, authKey, authIV);
// console.log("decryptedStringForRequest :: " + decryptedStringForRequest);


exports.addPPayment = catchAsync(async (req, res, next) => {

    var payerName = req.body.payerName;
    var payerEmail = req.body.payerEmail;
    var payerMobile = req.body.payerMobile;
    var clientTxnId = randomStr(20, "12345abcde");
    var amount = 1;
    var clientCode = "LPSD1";       // Please use the credentials shared by your Account Manager  If not, please contact your Account Manage
    var transUserName = "Abh789@sp";      // Please use the credentials shared by your Account Manager  If not, please contact your Account Manage
    var transUserPassword = "P8c3WQ7ei";   // Please use the credentials shared by your Account Manager  If not, please contact your Account Manage
    const callbackUrl = "http://localhost:4800/api/v1/pgresponse";
    const channelId = "W";
    // const spURL = "https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1"; // Staging environment
    //var spURL = "https://uatsp.sabpaisa.in/SabPaisa/sabPaisaInit"; // UAT environment
    var spDomain = 'https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1'; // production environment
    var env = "stage";
    var mcc = "5666";
    var transData = new Date();

    var stringForRequest =
        "payerName=" +
        payerName +
        "&payerEmail=" +
        payerEmail +
        "&payerMobile=" +
        payerMobile +
        "&clientTxnId=" +
        clientTxnId +
        "&amount=" +
        amount +
        "&clientCode=" +
        clientCode +
        "&transUserName=" +
        transUserName +
        "&transUserPassword=" +
        transUserPassword +
        "&callbackUrl=" +
        callbackUrl +
        "&channelId=" +
        channelId +
        "&mcc=" +
        mcc +
        "&transData=" +
        transData;
    "&env=" + env

    console.log("stringForRequest :: " + stringForRequest);

    var encryptedStringForRequest = encrypt(stringForRequest);
    console.log("encryptedStringForRequest :: " + encryptedStringForRequest);

    // Decrypt the encrypted string
    const decryptedStringForRequest = decryptData(encryptedStringForRequest, authKey, authIV);
    console.log("decryptedStringForRequest :: " + decryptedStringForRequest);

    const formData = {
        spDomain: spDomain,
        encData: encryptedStringForRequest,
        clientCode: clientCode,
    };

    res.json({
        formData: formData,
        decryptedStringForRequest: decryptedStringForRequest
    });

    // res.json({
    //     formData: formData
    // })
});


exports.pgresponse = catchAsync(async (req, res, next) => {
    let body = "";
    req.on("data", function (data) {
        console.log('data =>',data);
        
        body += data;
        console.log("sabpaisa response :: " + body);
        var decryptedResponse = decryptData(
            decodeURIComponent(body.split("&")[1].split("=")[1])
        );
        console.log("decryptedResponse :: " + decryptedResponse);

        // res.render(__dirname + "/pg-form-response.html", {
        //     decryptedResponse: decryptedResponse,
        // });
    });
})