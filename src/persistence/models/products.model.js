const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 500 },
    price: { type: Number, required: true },
    thumbnail: [{
        links: {type: String} 
    }],
    code: { type: String, required: true, max: 30, unique: true },
    owner: { type: String, required: true, default: "admin" },
    status: { type: Boolean, default: true},
    category: { type: String, required: true, max: 50 },
    stock: { type: Number, required: true }
})

productsSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productsCollection, productsSchema);

module.exports = productsModel;
