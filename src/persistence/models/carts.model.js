const mongoose = require('mongoose');

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    product: [{
        idP: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, 
        quantity: { type: Number }
    }]
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

module.exports = cartsModel;