const mongoose = require('mongoose');
const Nanoid = require('nanoid');
const Schema = mongoose.Schema;

var today = new Date();
var a = today.toISOString().substring(0, 10);

const id = Nanoid.customAlphabet('ABCDEF1234567890', 4);

const product = new Schema({
    _id: {type: String, default: () => id()},
    ProductName : { type: String},
    ProductPrice: {type : Number, default: 0},
    ProductDes: {type: String, default: ""},
    ProductQuantity: {type: Number, default: 0},
    categoryId: {type: String},
    image: [{ type: String}],
    sold: {type: Number, default: 0},
});

module.exports = mongoose.model('product', product)