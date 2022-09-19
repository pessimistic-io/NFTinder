# NFTinder

P2P NFT Exchange with Tinder-like UX:
- Select your NFT for trade
- Browse and like other NFT
- If you have a match, swap matched NFTs!

Under the hood:
- All NFTs should be approved for `NFTinder` contract first
- One user signs an ERC-712 message with a list of acceptable trades
- Another user calls `swap` function to execute one of those trades 

Efficient implementation requires NFT approvals (50k gas per token or collection) and 100k gas per swap. The contract checks user signatures and swaps NFTs atomically.
