const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dislikeSchema = new Schema({
    disliker_collection_address: {type: String},
    disliker_token_id: {type: String},
    disliked_collection_address: {type: String},
    disliked_token_id: {type: String}
});

module.exports = mongoose.model('DislikeNft', dislikeSchema);