const mongoose = require('mongoose');
const Nanoid = require('nanoid');
const Schema = mongoose.Schema;

var today = new Date();
var a = today.toISOString().substring(0, 10);

const id = Nanoid.customAlphabet('ABCDEF1234567890', 4);

const category = new Schema({
    _id: {type: String, default: () => id()},
    CateName: { type: String},
    createAt: { type: String, default: a }
});

module.exports = mongoose.model('category', category)