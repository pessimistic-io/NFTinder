const {
  buildSchema
} = require('graphql');

module.exports = buildSchema(`
type DislikeNft{
    _id: ID!
    nft: Nft!
    user: User!
}

type LikeNft{
  _id: ID!
  nftOwn: Nft!
  nftLike: Nft!
}

type SignNft{
  _id: ID!
  nft: Nft!
  user: User!
}

type Nft{
  _id: ID!
  chainId: String!
  collectionAddress: String!
  tokenId: String!
  ownerWallet: String!
}

type User{
  _id: ID!
  wallet: String!
}

type Signature{
  _id: ID!
  signature: String!
  isExpired: Boolean!
}

input NftInput{
  chainId: String!
  collectionAddress: String!
  tokenId: String!
  ownerWallet: String!
}

input UserInput{
  wallet: String!
}

input SignatureInput{
  signature: String!
}

type RootQuery {
    nfts: [Nft!]
    singleNft(nftOwnId: ID!): Nft!
    showLikeNfts(nftOwnId: ID!): [Nft!]
    showUnseenNfts(user: String!): [Nft!]
}

type RootMutation {
    auth(nftInput: NftInput!): Nft!
    addNft(nftInput: NftInput!): Nft!
    likeNft(nftLikeId: ID!, nftOwnId: ID!): LikeNft!
    dislikeNft(nftDislikeId: ID!, nftOwnId: ID!): DislikeNft!
    signNfts(nftIds: [ID!], signature: SignatureInput!): Signature!
    saveSignature(signId: SignatureInput!): Signature!
    clearUserData(userInput: ID!, nftInput: ID!): User!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);