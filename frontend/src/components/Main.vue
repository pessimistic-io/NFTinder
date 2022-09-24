<template>
  <div :class="$style.Main">
    <h3>Your account: {{ main_account }}</h3>
    <form>
      <h4>Select the NFT that you want to swap</h4>
      <p v-if="nfts.length === 0">You have no NFTs in your wallet</p>
      <ul v-else>
        <li v-for="nft in nfts">
          <input :id="nft.id" name="nft" type="radio" v:onclick="">
          <label :for="nft.id">{{ nft.name }}</label>
        </li>
      </ul>

      <button v:onclick="submit">Use this nfts for play</button>
    </form>
  </div>
</template>
<script>

import { getQuicknodeProvider } from '@/scripts/getQuicknodeProvider';

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
      quicknode_provider: {},
      selected_nft: {}
      /* //graphql format:
        type Nft{
          _id: ID!
          chainId: String!
          collectionAddress: String!
          tokenId: String!
          ownerWallet: String!
        }
      */
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
      this.quicknode_provider = getQuicknodeProvider();
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
        page: 1,
        perPage: 40
      });
      console.log(nfts);
      this.nfts = nfts.assets;
    },

    async submit() {

      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.selected_nft)
      });

      console.log(response)
    }
  },
};

</script>
<style lang="scss" module>

.Main {
  maring:2em;
}
</style>
