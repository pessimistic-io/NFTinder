const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeSchema = new Schema({
    liker_collection_address: {
        type: String,
        required: true
    },
    liker_token_id: {
        type: String,
        required: true
    },
    liked_collection_address: {
        type: String,
        required: true
    },
    liked_token_id: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('LikeNft', likeSchema);