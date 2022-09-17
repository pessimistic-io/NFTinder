import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/utils/cryptography/draft-EIP712.sol";
import "openzeppelin-solidity/contracts/utils/cryptography/ECDSA.sol";

pragma solidity ^0.8.0;
pragma abicoder v2;
// SPDX-License-Identifier: GNU AGPLv3

library Lib {
    struct NFT {
        address collection;
        uint tokenId;
    }

    struct Order {
        NFT nft;
        NFT[] nfts;
        uint index;
    }

    bytes32 constant private ORDER_TYPEHASH = keccak256(
        "Order("
            "NFT nft,"
            "NFT[] nfts,"
            "uint256 index"
        ")"
        "NFT("
            "address collection,"
            "uint256 tokenId"
        ")"
    );

    bytes32 constant private NFT_TYPEHASH = keccak256(
        "NFT("
            "address collection,"
            "uint256 tokenId"
        ")"
    );

    function hash(NFT calldata nft) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(NFT_TYPEHASH, nft.collection, nft.tokenId));    
    }

    function hash(NFT[] calldata nfts) private pure returns (bytes32) {
        uint n = nfts.length;
        bytes32[] memory hashes = new bytes32[](n);
        for (uint i = 0; i < n; i++) {
            hashes[i] = hash(nfts[i]);
        }
        return keccak256(abi.encodePacked(hashes));    
    }

    function hash(Order calldata order) internal pure returns (bytes32) {
        bytes32 nftHash = hash(order.nft);
        bytes32 nftsHash = hash(order.nfts);
        return keccak256(abi.encodePacked(ORDER_TYPEHASH, nftHash, nftsHash, order.index));
    }

}

contract NFTinder is EIP712("NFTinder", "0.1") {
    using Lib for Lib.Order;

    function hashOrder(Lib.Order calldata order) public view returns (bytes32) {
        return _hashTypedDataV4(order.hash());
    }

    function entry(Lib.Order calldata order, bytes calldata signature) external {
        bytes32 hash = hashOrder(order);
        (address u2, ECDSA.RecoverError err) = ECDSA.tryRecover(hash, signature);
        require (u2 != address(0) && err == ECDSA.RecoverError.NoError);
        swap(msg.sender, order.nfts[order.index], u2, order.nft);
    }

    function swap(address u1, Lib.NFT calldata nft1, address u2, Lib.NFT calldata nft2) private {
        IERC721(nft1.collection).transferFrom(u1, u2, nft1.tokenId);
        IERC721(nft2.collection).transferFrom(u2, u1, nft2.tokenId);
    }
}
