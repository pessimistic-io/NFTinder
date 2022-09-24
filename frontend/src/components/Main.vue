<template>
  <div :class="$style.Main">
    <h3>Your account: {{ target_account }}</h3>
    <form>
      <h4>Select the NFT that you want to swap</h4>
      <p v-if="nfts.length === 0">You have no NFTs in your wallet</p>
      <ul v-else>
        <li v-for="nft in nfts">
          <input :id="nft.id" type="radio">
          <label :for="nft.id">{{ nft.name }}</label>
        </li>
      </ul>
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
        wallet: this.target_account
      });
      console.log(nfts);
      this.nfts = nfts.assets;
    },
  },
};

</script>
<style lang="scss" module>

.Main {
  //
}
</style>
