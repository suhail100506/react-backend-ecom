const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'Other'
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
