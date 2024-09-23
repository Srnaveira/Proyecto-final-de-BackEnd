const mongoose = require('mongoose');

const ticketsCollection = 'tickets';

const ticketsSchema = new mongoose.Schema({
    code:{ type: mongoose.Schema.Types.ObjectId, auto: true, unique: true, max: 100 },
    purchase_datetime:{ type: Date, required: true },
    amount:{ type: Number, required: true},
    products: [{
        idP: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true }, 
        quantity: { type: Number, required: true },
        price: {type: Number, required: true}
    }],
    purchaser:{ type: String, required: true}

});


const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);

module.exports = ticketsModel;