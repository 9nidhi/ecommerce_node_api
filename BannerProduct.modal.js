const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addBannerProductSchema = new Schema({
    bannerPName: {
        type: String

    },
    price: {
        type: String

    },
    details: {
        type: String
    },
    bannerPImg: [{
        data: Buffer,
        type: String,
    }],
    discountPrice: {
        type: Number
    },
    subCategoryId: {
        type: String,
    },
    subcategoryName:{
        type: String,
    },
    MaincategoryName:{
        type: String,
    },
    size: [],
    bottomSize:[],
    shoesSize:[],
    rating:{
        type:Number
    }
}, { timestamps: true });

const AddBannerProduct = mongoose.model('AddBannerProduct', addBannerProductSchema);
module.exports = AddBannerProduct;