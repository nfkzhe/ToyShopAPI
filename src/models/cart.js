const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  _id: { type: String, required: true }, // productId
  ProductName: String,
  ProductPrice: Number,
  image: [String],
  quantity: { type: Number, default: 1 },
});

const cartSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  cart: [cartItemSchema],
});

module.exports = mongoose.model('cart', cartSchema);
