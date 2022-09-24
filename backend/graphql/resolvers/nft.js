const Nft = require('../../models/nft');
const User = require('../../models/user');
const LikeNft = require('../../models/likeNft')
const DislikeNft = require('../../models/dislikeNft')

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
    },
    likeNft: async args => {
        try {
            const user = await User.findOne({
                wallet: args.userInput.wallet
            });
            const currentNft = await Nft.findOne({
                _id: args.nftId
            });
            const likedNft = new LikeNft({
                user: user,
                nft: currentNft
            });
            await likedNft.save();
            const convertedLikedNft = {
                ...likedNft,
                _id: likedNft._id.toString()
            }
            return convertedLikedNft;
        } catch (err) {
            throw err;
        }
    },
    dislikeNft: async args => {
        try {
            const user = await User.findOne({
                wallet: args.userInput.wallet
            });
            const currentNft = await Nft.findOne({
                _id: args.nftId
            });
            const dislikedNft = new DislikeNft({
                user: user,
                nft: currentNft
            });
            await dislikedNft.save();
            const converteddislikedNft = {
                ...dislikedNft,
                _id: dislikedNft._id.toString()
            }
            return converteddislikedNft;
        } catch (err) {
            throw err;
        }
    }
}