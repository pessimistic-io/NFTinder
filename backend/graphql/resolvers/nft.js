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
        const liker_collection_address = args.liker_collection_address;
        const liker_token_id = args.liker_token_id;
        try {
            await Nft.deleteOne({
                _id: args.nftOwnId
            });
            await User.deleteOne({
                _id: args.user
            });
            await LikeNft.deleteMany({
                liker_collection_address: liker_collection_address,
                liker_token_id: liker_token_id,
            });
            await DislikeNft.deleteMany({
                disliker_collection_address: liker_collection_address,
                disliker_token_id: liker_token_id
            });
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

            const us_like = await LikeNft.find({
                liked_collection_address: args.collectionAddress,
                liked_token_id: args.tokenId
            })
            const filtered = nfts
                .filter(not_own)
                .filter(n => {
                    const c = likes.find(l => {
                        return l.liked_collection_address == n.collectionAddress
                        && l.liked_token_id == n.tokenId
                    })

                    const d = dislikes.find(l=>{
                      return l.disliked_collection_address == n.collectionAddress
                        && l.disliked_token_id == n.tokenId
                    })

                    return !c && !d;
                })

            const liked = []

            const other = []

            filtered.forEach(n=>{

                if (us_like.find(l=>l.liker_collection_address==n.collectionAddress
                    &&l.liker_token_id==n.tokenId)) {
                    liked.push(n)
                } else {
                    other.push(n)
                }
            })

            const all = liked.concat(other)

            return all.map(transformNft)


        } catch (err) {
            throw err;
        }

    },

    findMatch: async args => {

        const is_match = my=>yours=> {
            return my.liked_token_id == yours.liker_token_id
        && my.liked_collection_address == yours.liked_collection_address
        }

        try {

            const we_like = await LikeNft.find({
                liker_collection_address: args.collectionAddress,
                liker_token_id: args.tokenId
            })
            const us_like = await LikeNft.find({
                liked_collection_address: args.collectionAddress,
                liked_token_id: args.tokenId
            })

            const match = we_like.find(we=>{
                return us_like.find(is_match(we));
            })

            if (!match) return ['','','','']

            console.log('MATCH');
            console.log(match);

            return [
                match.liker_collection_address,
                match.liker_token_id,
                match.liked_collection_address,
                match.liked_token_id
            ]

        } catch (err) {
            throw err;
        }
    }
}