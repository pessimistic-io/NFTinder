const Nft = require('../../models/nft');

const {
    transformNft
} = require('./merge');

module.exports = {
    nfts: async () => {
        try {
            const nfts = await Nft.find();
            return nfts.map(nft => {
                return transformNft(nft);
            });
        } catch (err) {
            throw err;
        }
    }
}