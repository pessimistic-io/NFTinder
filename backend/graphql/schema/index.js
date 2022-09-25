const {
  buildSchema
} = require('graphql');

module.exports = buildSchema(`

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
  collectionName: String
  picUrl: String
  ownerWallet: String!
}

type Like {
  _id: ID!
  liker_collection_address: String!
  liker_token_id: String!
  liked_collection_address: String!
  liked_token_id: String!
}

type Dislike {
  _id: ID!
  disliker_collection_address: String!
  disliker_token_id: String!
  disliked_collection_address: String!
  disliked_token_id: String!
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
  picUrl: String!
  collectionName: String!
  ownerWallet: String!
}

input UserInput{
  wallet: String!
}

input SignatureInput{
  signature: String!
}

input LikeInput {
  liker_collection_address: String
  liker_token_id: String
  liked_collection_address: String
  liked_token_id: String
}

input DislikeInput {
  disliker_collection_address: String
  disliker_token_id: String
  disliked_collection_address: String
  disliked_token_id: String
}

type RootQuery {
    nfts: [Nft!]
    singleNft(nftOwnId: ID!): Nft!
    showLikeNfts(nftOwnId: ID!): [Nft!]
    findMatch(likeInput: LikeInput!): Nft
    findMatchAll(collectionAddress: String!, tokenId: String!): Nft
    showUnseenNfts(user: String!, collectionAddress: String!, tokenId: String!): [Nft!]
}

type RootMutation {
    auth(nftInput: NftInput!): Nft!
    addNft(nftInput: NftInput!): Nft!
    likeNft(likeInput: LikeInput!): Like!
    dislikeNft(dislikeInput: DislikeInput!): Dislike!
    signNfts(nftIds: [ID!], signature: SignatureInput!): Signature!
    saveSignature(signId: SignatureInput!): Signature!
    cleanDb(nftOwnId: ID!, likeInput: LikeInput): Nft!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);