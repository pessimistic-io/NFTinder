const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const signSchema = new Schema({
    nft: {
        type: Schema.Types.ObjectId,
        ref: 'Nft'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    signature: {
        type: Schema.Types.ObjectId,
        ref: 'Signature'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SignNfts', signSchema);