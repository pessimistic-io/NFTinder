const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const signatureSchema = new Schema({
    signature_data: {
        type: String,
        required: true
    },
    nft_collection: {
        type: String,
        required: true
    },
    nft_token: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Signature', signatureSchema);