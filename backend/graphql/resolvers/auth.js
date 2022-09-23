const Nft = require('../../models/nft');
const User = require('../../models/user');

module.exports = {
  auth: async args => {
    try {
      const existingNft = await Nft.findOne({
        chainId: args.nftInput.chainId,
        collectionAddress: args.nftInput.collectionAddress,
        tokenId: args.nftInput.tokenId,
        ownerWallet: args.nftInput.ownerWallet,
      })
      const user = await User.findOne({
        wallet: args.userInput.wallet
      });
      if (user != null && !existingNft) {
        return null;
      }
      if (existingNft && existingNft.ownerWallet == user.wallet) {
        return existingNft;
      } else {
        const user = new User({
          wallet: args.userInput.wallet,
        });
        const nft = new Nft({
          chainId: args.nftInput.chainId,
          collectionAddress: args.nftInput.collectionAddress,
          tokenId: args.nftInput.tokenId,
          ownerWallet: args.nftInput.ownerWallet,
        });
        if (user.wallet == nft.ownerWallet) {
          await user.save();
          await nft.save();
          return nft;
        }
      }
    } catch (err) {
      throw err;
    }
  },
};