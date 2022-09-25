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
            const likedNft = new LikeNft(args);
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
            const dislikedNft = new DislikeNft(args);
            await dislikedNft.save();

            const converteddislikedNft = {
                ...dislikedNft,
                _id: dislikedNft._id.toString()
            }
            return converteddislikedNft;
        } catch (err) {
            throw err;
        }
    },
    // выдаёт нфт для показа
    showUnseenNfts: async args => {

        const user = args.user
        const not_own = n=>n.ownerWallet!=user

        try {

            const nfts = await Nft.find()
            const likes = await LikeNft.find({
                liker_collection_address: args.collectionAddress,
                liker_token_id: args.tokenId
            })
            const dislikes = await DislikeNft.find({
                disliker_collection_address: args.collectionAddress,
                disliker_token_id: args.tokenId
            })


            // console.log(likes)


            return nfts
                .filter(not_own)
                .filter(n=>{ // TODO
                    return !likes.concat(dislikes).find(l=>l.collectionAddress==n.collectionAddress&&l.tokenId==n.tokenId)
                })
                .map(transformNft)

        } catch (err) {
            throw err;
        }

    }
}