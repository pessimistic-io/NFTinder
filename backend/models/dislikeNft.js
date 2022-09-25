const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dislikeSchema = new Schema({
    disliker_collection_address: {
        type: String,
        required: true
    },
    disliker_token_id: {
        type: String,
        required: true
    },
    disliked_collection_address: {
        type: String,
        required: true
    },
    disliked_token_id: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('DislikeNft', dislikeSchema);