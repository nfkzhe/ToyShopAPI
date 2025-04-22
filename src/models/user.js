const Nanoid = require('nanoid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const id = Nanoid.customAlphabet('ABCDEF1234567890', 6);
var today = new Date();
var a = today.toISOString().substring(0, 10);

// Schema phụ cho địa chỉ giao hàng
const shippingAddressSchema = new Schema({
    name: { type: String }, // Tên gợi nhớ: Nhà riêng, Công ty,...
    recipient: { type: String },
    phone: { type: String },
    address: { type: String },
    isDefault: { type: Boolean, default: false }
}, { _id: false });

// Schema chính cho user
const user = new Schema({
    _id: {
        type: String,
        default: () => id(),
    },
    email: { type: String },
    ten: { type: String },
    pass: { type: String },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    shippingAddresses: [shippingAddressSchema],
    favoriteProducts: [{ type: String, ref: 'product' }],
    sex: { type: String, default: "" },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    CreateAt: { type: Date, default: a },
});

module.exports = mongoose.model('user', user);
