const mongoose = require('mongoose')

const cart = new mongoose.Schema({
    id : {type : String},
})

module.exports = mongoose.model('cart', cart)