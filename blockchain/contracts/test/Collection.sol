import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

pragma solidity ^0.8.0;
// SPDX-License-Identifier: GNU AGPLv3

contract Collection is ERC721 {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address u, uint id) external {
        _mint(u, id);
    }
}