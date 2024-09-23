const mongoose = require('mongoose');

const messagesCollections = 'messages';

const messagesSchema = new mongoose.Schema({
    user: { type: String, required: true, max: 100},
    message: { type: String, required: true, max: 500 }

});

const messagesModel = mongoose.model(messagesCollections, messagesSchema);

module.exports = messagesModel;