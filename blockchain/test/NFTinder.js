const { expect } = require("chai");
const { ethers } = require("hardhat");
// const {expectRevert, expectEvent} = require("@openzeppelin/test-helpers");

describe("NFTinder", function () {
    let NFTinder
    let Domain
    let Types


    before(async function () {
        let factory = await ethers.getContractFactory("NFTinder");
        NFTinder = await factory.deploy();

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
            let factory = await ethers.getContractFactory("NFTinder")
            NFTinder = await factory.deploy()
            console.log("NFTinder is " + NFTinder.address)

            factory = await ethers.getContractFactory("Collection")
            C1 = await factory.deploy("Collection One", "C1")
            C2 = await factory.deploy("Collection Two", "C2")
            
            const [owner, u1, u2] = await ethers.getSigners()
            console.log("owner is " + owner.address)
            console.log("U1 is " + u1.address)
            console.log("U2 is " + u2.address)
            console.log("C1 is " + C1.address)
            console.log("C2 is " + C2.address)



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

            console.log("setup complete")

        });


        it("Should trade NFTs", async function () {
            const [owner, u1, u2] = await ethers.getSigners()

           
            const Order = {
                nft: {collection: C1.address, tokenId: '1'},
                nfts: [
                    {collection: C1.address, tokenId: '2'},
                    {collection: C2.address, tokenId: '1'},
                    {collection: C2.address, tokenId: '2'},
                ]
            };

            // const tde = ethers.utils._TypedDataEncoder.from(Types)
            // console.log("TDE: %s", tde.types)
            // console.log(ethers.utils.TypedDataEncoder.getPayload(domain, types, value))
            // console.log("Primary type: %s", tde.getPrimaryType(Types))
            // console.log("tde Hash : %s", tde.encode(Domain, Types, Order))
        

            // console.log("hash = %s", hash)
            const signature = await u1._signTypedData(Domain, Types, Order)
            console.log("signature = %s", signature)
            const hash = await NFTinder.hash(Order)
            // console.log("hash = %s", hash)
            // console.log("simple recover from hash: %s", ethers.utils.verifyMessage(hash, signature))
            // const recovAddr = ethers.utils.recoverAddress(hash, signature)
            // console.log("recovered address from hash+sig: %s", recovAddr)
            // const verifiedAddress = ethers.utils.verifyTypedData(Domain, Types, Order, signature)

            // console.log("recovered address from data+sig: %s", verifiedAddress)
            // expect(u1.address).to.equal(verifiedAddress)


            const tx = await NFTinder.connect(u2).entry(1, Order, signature)
            const rc = await tx.wait()
            const event = rc.events.find(event => event.event === 'Swap');
            console.log(event.args);


            // await expect(NFTinder.connect(u2).entry(1, Order, signature))
                    // .not.to.be.reverted
                // .to.emit(NFTinder, "Swap")
                // .to.emit(NFTinder, "Tr")
                // .withArgs(u1.address,u2.address,C2.address,1)
                // .to.emit(C1, "Transfer")
                // .to.emit(C2, "Transfer")
            // await NFTinder.connect(u2).entry(1, Order, signature)

            // const o11 = await C1.ownerOf(1)
            // console.log(o11 + " is the owner of C1/1")

            // const o21 = await C2.ownerOf(1)
            // console.log(o21 + " is the owner of C2/1")

            // expect(o11).to.equal(u2.address)
            // console.log("U2 is the owner of C1/1")            
            // expect(o21).to.equal(u1.address)
            // console.log("U1 is the owner of C2/1")            




            // let receipt = await NFTinder.connect(u2).entry(1, Order, signature)
            // await expectEvent(receipt, 'Swap')
            // console.log(receipt)

        });
    })



});
