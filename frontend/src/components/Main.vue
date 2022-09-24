<template>
  <div :class="$style.Main">
    <h3>Your account: {{ main_account }}</h3>
    <form>
      <h4>Click to select the NFT that you want to swap</h4>
      <p v-if="nfts.length === 0">You have no suitable NFTs in your wallet</p>
      <ul v-else>
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
      <p v-if="bad_nfts != 0">Note: You have {{bad_nfts}} NFTs without picture</p>

    </form>
  </div>
</template>
<script>

import { ethers } from 'ethers';

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
    }
  },

  async created() {
    this.setQuicknodeProvider();
    /* duplicates accounts watcher handler, because of "immediate: false" */
    this.updateMainAccount();
    await this.updateNfts();
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
        wallet: this.target_account,
        omitFields: ["traits", "provenance"],
        page: 1,
      });
      
      this.bad_nfts = nfts.assets.filter(nft => !nft.imageUrl).length;
      
      /* Filter out those that have no image links */
      this.nfts = nfts.assets.filter((nft) => {
        return nft.imageUrl;
      });

    },


    async selectNft(event) {

      console.log(this.normalized_selected_nft)

      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            mutation {
              addNft(objects: [{ nftInput: $nft}]) {
                returning {
                  id
                  created_at
                }
              }
            }`,
          variables:{nft: this.normalized_selected_nft}
        })
      });


      // return false;
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
}
</style>
