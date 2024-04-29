const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
    id: {
		type: String,
        required: true,
        default: `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
        unique: true,
        // immutable: true
	},
    SubCateoryName:{
        type:String,
    },
    mainCategoryId: {
        type: String,
    },
    mainCategoryName:{
        type:String
    },
    subCatImg:{
        type:String
    },
    sizeImg:{
        type:String
    }
}, {timestamps: true});

subCategorySchema.statics.deleteByCatId = function (catId) {
    return this.deleteMany({ mainCategoryId: catId });
};

const SubCategory = mongoose.model('subCategory',subCategorySchema)

module.exports = SubCategory;