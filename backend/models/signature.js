const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const signatureSchema = new Schema({
    signature: {
        type: String,
        required: true
    },

    isExpired: {
        type: Boolean,
        required: true
    }

});

module.exports = mongoose.model('Signature', signatureSchema);