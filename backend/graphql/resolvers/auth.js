const Nft = require('../../models/nft');

module.exports = {
  auth: async args => {
    try {
      const existingNft = await Nft.findOne({
        chainId: args.nftInput.chainId,
        collectionAddress: args.nftInput.collectionAddress,
        tokenId: args.nftInput.tokenId,
        picUrl: args.nftInput.picUrl,
        collectionName: args.nftInput.collectionName,
        ownerWallet: args.nftInput.ownerWallet,
      })
      if (existingNft) {
        return existingNft;
      } else {
        const nft = new Nft({
          chainId: args.nftInput.chainId,
          collectionAddress: args.nftInput.collectionAddress,
          tokenId: args.nftInput.tokenId,
          picUrl: args.nftInput.picUrl,
          collectionName: args.nftInput.collectionName,
          ownerWallet: args.nftInput.ownerWallet,
        });
        await nft.save();
        return nft;
      }
    } catch (err) {
      throw err;
    }
  },
};