const _ = require("lodash");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../Model/Product.model");
const Cart = require("../Model/Cart.modal");
const SubCategory = require("../Model/SubCategory.model");

exports.addCart = catchAsync(async (req, res, next) => {
  const { product_id, qty } = req.body;
  console.log('qty: ', qty);

  try {
    let cart = await Cart.findOne({ "items.product_id": product_id });

    if (!cart) {
      const productDetails = await Product.findById(product_id)
        .select('pName price details pImg discountPrice size stock');

      if (!productDetails) {
        throw new AppError('Product not found', 404);
      }

      cart = new Cart({
        items: [
          {
            product_id: product_id,
            qty: qty,
            productDetails: productDetails.toObject() 
          }
        ]
      });

      await cart.save();
    } else {
      const indexFound = cart.items.findIndex(item => {
        return item.product_id.toString() === product_id;
      });

      if (indexFound !== -1 && qty <= 0) {
        cart.items.splice(indexFound, 1);
      } else if (indexFound !== -1) {
        cart.items[indexFound].qty = cart.items[indexFound].qty + qty;
      } else if (qty > 0) {
        const productDetails = await Product.findById(product_id)
          .select('pName price details pImg discountPrice size stock');

        cart.items.push({
          product_id: product_id,
          qty: qty,
          productDetails: productDetails.toObject() 
        });
      } else {
        throw new AppError('Invalid request', 400);
      }
      
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    let error;

    if (err instanceof AppError) {
      error = err;
    } else {
      error = new AppError(err.message, 500);
    }

    return next(error);
  }
});
