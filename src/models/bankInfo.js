const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bankInfo = new Schema({
    email: { type: String},
    bankName: { type: String},
    account: { type: String},
    number: { type: String},

});

module.exports = mongoose.model('bankInfo', bankInfo)