const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
    bannerImg: {
        type: String,   
    },
    subcategoryName:{
        type: String,
    },
    subCategoryBannerId: {
        type: String,
    },
    MaincategoryName:{
        type: String,
    },
}, { timestamps: true });

const Banner = mongoose.model('banner', bannerSchema);

module.exports = Banner;