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
            const nftOwn = await Nft.findOne({
                _id: args.nftOwnId
            })
            const nftList = nfts.map(nft => {
                return transformNft(nft);
            });
            for (let i = 0; i < nftList.length; i++) {
                currentNft = nftList[i];
                if (currentNft.ownerWallet != nftOwn.ownerWallet) {
                    return currentNft;
                }
            }
        } catch (err) {
            throw err;
        }
    },
    likeNft: async args => {
        try {
            const nftOwn = await Nft.findOne({
                _id: args.nftOwnId
            });
            const currentNft = await Nft.findOne({
                _id: args.nftLikeId
            });
            const likedNft = new LikeNft({
                nftOwn: nftOwn,
                nftLike: currentNft
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
    showLikeNfts: async args => {
        try {
            const likeNfts = await LikeNft.find();
            const nftOwn = await Nft.findOne({
                _id: args.nftOwnId
            });
            let nftList = [];
            for (let i = 0; i < likeNfts.length; i++) {
                if (likeNfts[i].nftOwn.toString() == nftOwn._id.toString()) {
                    const nft = await Nft.findOne({
                        _id: likeNfts[i].nftLike
                    })
                    const convertedNft = {
                        ...nft,
                        _id: nft._id.toString()
                    }
                    nftList.push(convertedNft)
                    console.log(nftList)
                }
            }
            return nftList;
        } catch (err) {
            throw err;
        }
    },
    dislikeNft: async args => {
        try {
            const nftOwn = await Nft.findOne({
                _id: args.nftOwnId
            });
            const currentNft = await Nft.findOne({
                _id: args.nftDislikeId
            });
            const dislikedNft = new DislikeNft({
                nftOwn: nftOwn,
                nftDislike: currentNft
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