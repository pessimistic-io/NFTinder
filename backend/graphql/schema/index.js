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
  nft: Nft!
  user: User!
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

type AuthData {
  userId: ID!
  wallet: String!
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
    singleNft(userInput: UserInput!): Nft!
    likedNft: [Nft!]
}

type RootMutation {
    auth(nftInput: NftInput!, userInput: UserInput!): Nft!
    addNft(nftInput: NftInput!): Nft!
    likeNft(nftId: ID!, userInput: UserInput!): LikeNft!
    dislikeNft(nftId: ID!): Nft!
    signNfts(nftIds: [ID!], signature: SignatureInput!): Signature!
    saveSignature(signId: SignatureInput!): Signature!
    clearUserData(userInput: ID!, nftInput: ID!): User!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);