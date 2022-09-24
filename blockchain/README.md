# NFTinder Smart Contracts

Under the hood:
- All NFTs should be approved for [`NFTinder` contract](https://etherscan.io/address/0x41d10937ffa30022575d7462bc59db7f2b302051) first
- One user signs an [ERC-712 message](https://eips.ethereum.org/EIPS/eip-712) with a list of acceptable trades
- Another user calls `swap` function to execute one of those trades 

Efficient implementation requires NFT approvals (50k gas per token or collection) and 100k gas per swap. The contract checks user signatures and swaps NFTs atomically.

## Running Tests

1. `yarn`
2. `yarn test`
