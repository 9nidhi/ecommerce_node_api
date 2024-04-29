// const CryptoJS = require('crypto-js');
// const axios = require('axios');

// // Function to encrypt data
// function encryptData(data, key, iv) {
//     const encryptedData = CryptoJS.AES.encrypt(data, key, { iv: iv }).toString();
//     return encryptedData;
// }

// // Function to create the request string
// function createRequestString(data) {
//     return Object.keys(data)
//         .map(key => `${key}=${encodeURIComponent(data[key])}`)
//         .join('&');
// }

// // Function to send form data
// async function sendFormData(encData, clientCode, url) {
//     try {
//         const formData = {
//             encData: encData,
//             clientCode: clientCode,
//         };

//         const response = await axios.post(url, formData);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// }

// module.exports = {
//     encryptData,
//     createRequestString,
//     sendFormData
// };
