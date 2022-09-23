const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dislikeSchema = new Schema({
    nft: {
        type: Schema.Types.ObjectId,
        ref: 'Nft'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DislikeNft', dislikeSchema);