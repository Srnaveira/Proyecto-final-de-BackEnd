const mongoose  = require('mongoose');

const usersCollections = 'Users';

const usersSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    age: {type: Number, required: true},
    password: {type: String, required: true},
    documentsUploaded: { type: Boolean, default: false },
    documents: [{ 
            name: {type: String } ,
            reference: {type: String }
        }],
    last_connection: {type: Date },
    rol: {type: String, default: "user"},
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'carts', required: true }
})

const usersModel = mongoose.model(usersCollections, usersSchema);

module.exports = usersModel;