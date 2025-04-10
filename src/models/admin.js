const Nanoid = require('nanoid');
const NanoidAsync = require('nanoid/async');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var today = new Date();
var a = today.toISOString().substring(0, 10);

const id = Nanoid.customAlphabet('ABCDEF1234567890', 6);

const admin  = new Schema({
    _id: {
        type: String,
        default: () => id(),
    },
    email: { type: String},
    ten: { type: String},
    pass: { type:String},
});

module.exports = mongoose.model('admin', admin)