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
            const likedNft = new LikeNft({
                liker_token_id: args.likeInput.liker_token_id,
                liker_collection_address: args.likeInput.liker_collection_address,
                liked_token_id: args.likeInput.liked_token_id,
                liked_collection_address: args.likeInput.liked_collection_address
            });
            await likedNft.save();
            return likedNft;
        } catch (err) {
            throw err;
        }
    },

    cleanDb: async args => {
        const liker_collection_address = args.likeInput.liker_collection_address;
        const liker_token_id = args.likeInput.liker_token_id;
        try {
            const nft = await Nft.findOne({
                _id: args.nftOwnId
            });
            await Nft.deleteOne({
                _id: args.nftOwnId
            });
            await LikeNft.deleteMany({
                liker_collection_address: liker_collection_address,
                liker_token_id: liker_token_id,
            });
            await DislikeNft.deleteMany({
                disliker_collection_address: liker_collection_address,
                disliker_token_id: liker_token_id
            });
            console.log(nft)
            return nft
        } catch (err) {
            throw err
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
            const dislikedNft = new DislikeNft({
                disliker_token_id: args.dislikeInput.disliker_token_id,
                disliker_collection_address: args.dislikeInput.disliker_collection_address,
                disliked_token_id: args.dislikeInput.disliked_token_id,
                disliked_collection_address: args.dislikeInput.disliked_collection_address
            });
            await dislikedNft.save();
            return dislikedNft;
        } catch (err) {
            throw err;
        }
    },
    // выдаёт нфт для показа
    showUnseenNfts: async args => {

        const user = args.user
        const not_own = n => n.ownerWallet != user

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
                .filter(n => { // TODO
                    return !likes.concat(dislikes).find(l => l.collectionAddress == n.collectionAddress && l.tokenId == n.tokenId)
                })
                .map(transformNft)

        } catch (err) {
            throw err;
        }

    },

    findMatch: async args => {

        // const is_match = my=>yours=> {
        //     return my.liked_token_id == yours.liker_token_id
        // && my.liked_collection_address == yours.liked_collection_address
        // }

        try {

            const we_like = await LikeNft.find({
                liker_collection_address: args.collectionAddress,
                liker_token_id: args.tokenId
            })
            const us_like = await LikeNft.find({
                liked_collection_address: args.collectionAddress,
                liked_token_id: args.tokenId
            })

            match = null

            for (var i = we_like.length - 1; i >= 0; i--) {
                const w = we_like[i]

                match = us_like.find(my=>{
                   return my.liker_token_id == w.liked_token_id
                && my.liker_collection_address == w.liked_collection_address
                })

                if (match) break;
            }

            if (!match) return null

            console.log('MATCH');

            const res = Nft.findOne({
                collectionAddress: match.liker_collection_address,
                tokenId: match.liker_token_id
            })

            console.log(res);


            return res

        } catch (err) {
            throw err;
        }
    }
}