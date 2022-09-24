const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const nftSchema = new Schema({
    chainId: {
        type: String,
        required: true
    },
    collectionAddress: {
        type: String,
        required: true
    },
    tokenId: {
        type: String,
        required: true
    },
    picUrl: {
        type: String,
        required: false
    },
    collectionName: {
        type: String,
        required: false
    },
    ownerWallet: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Nft', nftSchema);