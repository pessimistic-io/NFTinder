const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeSchema = new Schema({
    liker_collection_address: {type: String},
    liker_token_id: {type: String},
    liked_collection_address: {type: String},
    liked_token_id: {type: String}
});

module.exports = mongoose.model('LikeNft', likeSchema);