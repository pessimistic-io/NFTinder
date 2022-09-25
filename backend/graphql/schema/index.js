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

input Like {
  liker_collection_address: String!,
  liker_token_id: String!,
  liked_collection_address: String!,
  liked_token_id: String!
}

input Dislike {
  disliker_collection_address: String!,
  disliker_token_id: String!,
  disliked_collection_address: String!,
  disliked_token_id: String!
}

type RootQuery {
    nfts: [Nft!]
    singleNft(nftOwnId: ID!): Nft!
    showLikeNfts(nftOwnId: ID!): [Nft!]
    showUnseenNfts(user: String!, collectionAddress: String!, tokenId: String!): [Nft!]
}

type RootMutation {
    auth(nftInput: NftInput!): Nft!
    addNft(nftInput: NftInput!): Nft!
    likeNft(likeInput: Like!): Nft!
    dislikeNft(dislikeInput: Dislike!): Nft!
    signNfts(nftIds: [ID!], signature: SignatureInput!): Signature!
    saveSignature(signId: SignatureInput!): Signature!
    clearUserData(userInput: ID!, nftInput: ID!): User!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);