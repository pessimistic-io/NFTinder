const Nft = require('../../models/nft');
const User = require('../../models/user');

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
    },
    singleNft: async args => {
        try {
            const nfts = await Nft.find();
            const user = await User.findOne({
                wallet: args.userInput.wallet
            })
            const nftList = nfts.map(nft => {
                return transformNft(nft);
            });
            for (let i = 0; i < nftList.length; i++) {
                currentNft = nftList[i];
                if (currentNft.ownerWallet != user.wallet) {
                    return currentNft;
                }
            }
            return nftList[0]
        } catch (err) {
            throw err;
        }
    }
}