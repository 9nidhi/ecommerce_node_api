const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mainCategorySchema = new Schema({
    id: {
		type: String,
        required: true,
        default: `CAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
        unique: true,
        immutable: true
	},
	MaincategoryName: {
		type: String,
		unique: true,
	},
    categoryImg:{
        type: String,   
    }
	
	
}, {timestamps: true});

// mainCategorySchema.statics.deleteByCatId = function (catId) {
//     return this.deleteMany({ id: catId });
// };

const MainCategory = mongoose.model('mainCategory', mainCategorySchema);

module.exports = MainCategory;