const { expect } = require("chai");
const { ethers } = require("hardhat");
// const {expectRevert, expectEvent} = require("@openzeppelin/test-helpers");

describe("NFTinder", function () {
    let NFTinder
    let Domain
    let Types
    let Order


    before(async function () {
        const factory = await ethers.getContractFactory("NFTinder");
        NFTinder = await factory.deploy();
        // console.log("NFTinder is " + NFTinder.address)

        const network = await NFTinder.provider.getNetwork()
        const owner = await ethers.getSigners()
        Domain = {
            name: 'NFTinder',
            version: '0.1',
            chainId: network.chainId,
            verifyingContract: NFTinder.address
        };

        Types = {
            NFT: [
                { name: 'collection', type: 'address' },
                { name: 'tokenId', type: 'uint256' }
            ],
            Order: [
                { name: 'nft', type: 'NFT' },
                { name: 'nfts', type: 'NFT[]' }
            ]
        };
    });

    describe("NFTinder operates", function () {

        before(async function () {

            const factory = await ethers.getContractFactory("Collection")
            C1 = await factory.deploy("Collection One", "C1")
            C2 = await factory.deploy("Collection Two", "C2")
            
            const [owner, u1, u2] = await ethers.getSigners()
            // console.log("owner is " + owner.address)
            // console.log("U1 is " + u1.address)
            // console.log("U2 is " + u2.address)
            // console.log("C1 is " + C1.address)
            // console.log("C2 is " + C2.address)

            await C1.mint(u1.address,1)
            expect(await C1.ownerOf(1)).to.equal(u1.address)
            // console.log ("U1 is the owner of C1/1")            
            await C1.connect(u1).approve(NFTinder.address, 1)
            expect(await C1.getApproved(1)).to.equal(NFTinder.address)
            // console.log("U1 approved NFTinder for C1/1")

            await C1.mint(u2.address,2)
            await C2.mint(u2.address,1)
            await C2.mint(u2.address,2)


            expect(await C2.ownerOf(1)).to.equal(u2.address)
            // console.log ("U2 is the owner of C2/1")            
            await C1.connect(u2).approve(NFTinder.address, 2)
            expect(await C1.getApproved(2)).to.equal(NFTinder.address)
            // console.log("U2 approved NFTinder for C1/2")

            await C2.connect(u2).setApprovalForAll(NFTinder.address, true)
            expect(await C2.isApprovedForAll(u2.address, NFTinder.address)).to.equal(true)
            // console.log("U2 set NFTinder as operator for C2")

            // console.log("setup complete")

        });


        it("Should trade NFTs", async function () {
            const [owner, u1, u2] = await ethers.getSigners()

           
            Order = {
                nft: {collection: C1.address, tokenId: 1},
                nfts: [
                    {collection: C1.address, tokenId: 2},
                    {collection: C2.address, tokenId: 1},
                    {collection: C2.address, tokenId: 2},
                ]
            };

            const signature = await u1._signTypedData(Domain, Types, Order)

            await expect(NFTinder.connect(u2).swap(1, Order, signature))
                .to.emit(C1, "Transfer")
                .to.emit(C2, "Transfer")
        });
    })


});