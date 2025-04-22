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
    categoryId: {type: String},
    featured: {type:Boolean , default: false},
    discount: {type:Number, default: 0},
    image: [{ type: String}],
    inStock: {type:Boolean, default: true},
    sold: {type: Number, default: 0},
});

module.exports = mongoose.model('product', product)