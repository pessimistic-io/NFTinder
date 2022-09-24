const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeSchema = new Schema({
    nft: {
        type: Schema.Types.ObjectId,
        ref: 'Nft'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('LikeNft', likeSchema);