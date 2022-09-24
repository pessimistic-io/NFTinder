const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeSchema = new Schema({
    nftOwn: {
        type: Schema.Types.ObjectId,
        ref: 'Nft'
    },
    nftLike: {
        type: Schema.Types.ObjectId,
        ref: 'Nft'
    }
});

module.exports = mongoose.model('LikeNft', likeSchema);