<template>
  <div :class="$style.Main">
    <h3>Your account: {{ main_account }}</h3>
    <form>
      <h4>Click to select the NFT that you want to swap</h4>
      <p v-if="nfts.length === 0">You have no suitable NFTs in your wallet</p>
      <div v-else>
        <ul>
          <li v-for="nft in nfts"
              @click="handleNftUnitClick(nft.name)"
              :class="{
              [$style.nft_unit]: true,
              [$style.selected_nft]: isSelected(nft.name),
            }"
          >
            <img
              :class="$style.nft_image"
              :src="nft.imageUrl"
              :alt="nft.name"
            >
            <label :for="nft.id">{{ nft.name }}</label>
          </li>
        </ul>
        <button :class="$style.select_btn" type="button" @click="selectNft">Use this NFT!</button>
      </div>
      <p v-if="bad_nfts != 0">Note: You have {{bad_nfts}} NFTs without picture</p>
    </form>
  </div>
</template>
<script>

import { ethers } from 'ethers';

// const NFT_ABI = ['function approve(address _approved, uint256 _tokenId)']
const NFT_ABI = [
    'function approve(address, uint256)',
    'function setApprovalForAll(address, bool)',
    'function getApproved(uint256 tokenId) view returns (address)',
    'function isApprovedForAll(address, address) view returns (bool)'
  ]

export default {
  name: 'Main',

  props: {
    accounts: Array(0),
  },

  data: () => {
    return {
      main_account: "",
      target_account: "0xab5801a7d398351b8be11c439e05c5b3259aec9b",
      nfts: Array(0),
      bad_nfts: 0,
      selected_nft: "", // name
      quicknode_provider: {},
      provider: {}
    }
  },

  computed: {

    normalized_selected_nft() {

      const s = this.getNftByName(this.selected_nft)

      return {
        chainId: s.chain,
        collectionAddress: s.collectionAddress,
        ownerWallet: s.currentOwner,
        tokenId: s.collectionTokenId
      }
    }
  },


  async created() {
    this.setQuicknodeProvider();
    /* duplicates accounts watcher handler, because of "immediate: false" */
    this.updateMainAccount();
    await this.updateNfts();

    this.provider = new ethers.providers.Web3Provider(window.ethereum)

  },

  watch: {
    accounts: {
      immediate: false,
      handler: async function() {
        this.updateMainAccount();
        await this.updateNfts();
      }.bind(this),
    }
  },

  methods: {

    getNftByName(name) {

      return this.nfts.find(n=>n.name==name)
    },

    setQuicknodeProvider() {
      const provider = process.env.VUE_APP_QUICKNODE;
      this.quicknode_provider = new ethers.providers.JsonRpcProvider(provider);
    },

    updateMainAccount() {
      if(this.accounts) {
        this.main_account = this.accounts[0];
      }
    },

    async updateNfts() {
      if(!this.main_account) {
        throw "User account is not set: unable to update nfts";
      }

      const nfts = await this.quicknode_provider.send("qn_fetchNFTs", {
        wallet: this.main_account,
        omitFields: ["traits", "provenance"],
        page: 1,
      });

      this.bad_nfts = nfts.assets.filter(nft => !nft.imageUrl).length;

      /* Filter out those that have no image links */
      this.nfts = nfts.assets.filter((nft) => {
        return nft.imageUrl;
      });

    },

    async sendQuery(q) {

      return await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: q,
          variables:{}
        })
      })
    },


    async selectNft(event) {

      const s = this.normalized_selected_nft;


      const contract = new ethers.Contract(s.collectionAddress, NFT_ABI, this.provider)
          .connect(this.provider.getSigner())

      const NFTinder = process.env.VUE_APP_NFTINDER_ADDRESS;
      const approved_address = await contract.getApproved(s.tokenId);
      let approved = approved_address === NFTinder;
      console.log("Token %s is approved for NFTinder? %s", s.tokenId, approved)
      if (!approved) {
        approved = await contract.isApprovedForAll(this.main_account, NFTinder);
        console.log("Collection %s is approved for NFTinder? %s", s.collectionAddress, approved)
      }
      if (!approved) {
        const res = await contract.approve(NFTinder, s.tokenId);
        if (res) {

          alert('success')
        } else {
          // TODO
        }
      }

      const auth_query =
      `mutation{
        auth(
          nftInput: {
            chainId: "${s.chainId}",
            collectionAddress: "${s.collectionAddress}",
            tokenId: "${s.tokenId}",
            ownerWallet: "${this.main_account}"
          }
        ){chainId, collectionAddress, ownerWallet, tokenId}}`

      const response = await this.sendQuery(auth_query)

      if (response.status==200){

        const pics = await this.getAvilableNfts()
        console.log(pics)

      } else {
        console.log(response)
        alert('error')
      }

    },

    async getAvilableNfts() {

      const get_query =
      `
      query{
        showUnseenNfts(user:"${this.main_account}"){
          chainId
          collectionAddress
          tokenId
          ownerWallet
        }
      }`

      const r = await this.sendQuery(get_query)
      const result = await r.json()

      return result.data.showUnseenNfts

    },

    isSelected(nft_name) {
      return nft_name === this.selected_nft;
    },

    handleNftUnitClick(nft_name) {
      this.selected_nft = nft_name;
    }
  },
};

</script>
<style lang="scss" module>

.Main {

  .nft_unit {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    height: 100px;
    cursor: pointer;
  }

  .selected_nft {
    background-color: #dde;
  }

  .nft_image {
    height: 100px;
    margin-right: 15px;
  }

  .select_btn {
    height: 50px;
    width: 200px;
    font-size: 25px;
  }
}
</style>
