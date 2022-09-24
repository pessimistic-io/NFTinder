const authResolver = require('./auth');
const nftResolver = require('./nft');

const rootResolver = {
  ...authResolver,
  ...nftResolver
};

module.exports = rootResolver;