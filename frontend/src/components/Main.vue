<template>
  <div :class="$style.Main">
    <div v-if="!nft_authorized">
      <h3 :class="$style.account_title">Your account: {{ main_account }}</h3>
      <form>
        <h2 :class="$style.select_title">Click to select the NFT that you want to swap</h2>
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
                alt=""
              >
              <label :class="$style.nft_label" :for="nft.id">{{ nft.name }}</label>
            </li>
          </ul>
          <div :class="$style.select_btn_block">
            <button
              :class="$style.select_btn"
              type="button"
              @click="selectNft"
            >
              Let's go
            </button>
            <p :class="$style.select_label">({{ selected_nft }} will be automatically swapped after a mutual like)</p>
          </div>
        </div>
        <p v-if="bad_nfts != 0">Note: You have {{bad_nfts}} NFTs without picture</p>
      </form>
    </div>
    <Slider v-else
            :candidate_nfts="candidate_nfts"
            :provider="provider"
            :user_nft="getNftByName(selected_nft)"
            :main_account="main_account"
    />
  </div>
</template>
<script>

import { ethers } from 'ethers';
import Slider from '@/components/Slider';

// const NFT_ABI = ['function approve(address _approved, uint256 _tokenId)']
const NFT_ABI = [
    'function approve(address, uint256)',
    'function setApprovalForAll(address, bool)',
    'function getApproved(uint256 tokenId) view returns (address)',
    'function isApprovedForAll(address, address) view returns (bool)'
  ]

export default {
  name: 'Main',
  components: { Slider },
  props: {
    accounts: Array(0),
  },

  data: () => {
    return {
      main_account: "",
      nfts: Array(0),
      bad_nfts: 0,
      selected_nft: "", // name
      quicknode_provider: {},
      provider: {},
      nft_authorized: false,
      candidate_nfts: []
    }
  },

  computed: {

    normalized_selected_nft() {

      const s = this.getNftByName(this.selected_nft)

      return {
        chainId: s.chain,
        collectionAddress: s.collectionAddress,
        ownerWallet: s.currentOwner,
        tokenId: s.collectionTokenId,
        collectionName: s.collectionName,
        picUrl: s.imageUrl || ''
      }
    }
  },


  async created() {
    /* duplicates accounts watcher handler, because of "immediate: false" */
    this.updateMainAccount();
    await this.updateNfts();
    this.updateDefaultSelectedNft();

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
      return this.nfts.find(n => {
        return n.name===name;
      });
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
      
      const np = await this.askNftPort(this.main_account)
      const qn = await this.askQuickNode(this.main_account)
      const nfts = np.concat(qn)

      this.bad_nfts = nfts.filter(nft => !nft.imageUrl).length

      /* Filter out those that have no image links */
      this.nfts = nfts
          .filter((nft) => { return nft.imageUrl; })
    },

    async askQuickNode(account) {
      const quicknode = new ethers.providers.JsonRpcProvider(process.env.VUE_APP_QUICKNODE)

      const response = await quicknode.send("qn_fetchNFTs", {
        wallet: account,
        omitFields: ["traits", "provenance"],
        page: 1,
      })
      // console.log(response)
      return response.assets
        .filter(nft => nft.collectionAddress)
        .filter(nft => nft.collectionTokenId)
        .map(function(nft) {
          return {
            chain: nft.chain || 'ETH',
            collectionAddress: nft.collectionAddress,
            collectionTokenId: nft.collectionTokenId,
            currentOwner: account,
            collectionName: nft.collectionName || '',
            name: nft.name || '',
            imageUrl: nft.imageUrl || ''
          }
        })
    },

    async askNftPort(account) {
      const api = 'https://api.nftport.xyz/v0/accounts/' + account 
          + '?chain=ethereum&include=metadata&include=contract_information&exclude=erc1155'
      const response = await fetch(api, {
        method: 'GET',
        headers: {
          'Authorization': process.env.VUE_APP_NFTPORT_APIKEY,
          'Content-Type': 'application/json'
        }
      })
      const res = await response.json()
      // console.log(res)
      return res.nfts
        .filter(nft => nft.contract_address)
        .filter(nft => nft.token_id)
        .map(function(nft) {
          return {
            chain: 'ETH',
            collectionAddress: nft.contract_address,
            collectionTokenId: nft.token_id,
            currentOwner: account,
            collectionName: nft.contract.name || '',
            name: nft.name || '',
            imageUrl: nft.cached_file_url || nft.file_url || ''
          }
        })
    },

    updateDefaultSelectedNft() {
      this.selected_nft = this.nfts[0].name;
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

    async approve(collection, token) {
      const contract = new ethers.Contract(collection, NFT_ABI, this.provider)
          .connect(this.provider.getSigner())

      const NFTinder = process.env.VUE_APP_NFTINDER_ADDRESS;
      const approved_address = await contract.getApproved(token);
      let approved = approved_address === NFTinder;
      console.log("Token %s is approved for NFTinder? %s", token, approved)
      if (!approved) {
        approved = await contract.isApprovedForAll(this.main_account, NFTinder);
        console.log("Collection %s is approved for NFTinder? %s", collection, approved)
      }
      if (!approved) {
        const res = await contract.approve(NFTinder, token);
        if (res) {

          alert('success')
        } else {
          // TODO
        }
      }
    },

    async selectNft() {

      const s = this.normalized_selected_nft;
      try {
        await this.approve(s.collectionAddress, s.tokenId)
      } catch(e) {console.log (e)}



      const auth_query =
      `mutation{
        auth(
          nftInput: {
            picUrl: "${s.picUrl}",
            collectionName: "${s.collectionName}",
            chainId: "${s.chainId}",
            collectionAddress: "${s.collectionAddress}",
            tokenId: "${s.tokenId}",
            ownerWallet: "${this.main_account}"
          }
        ){ chainId, collectionAddress, ownerWallet, tokenId}}`

      const response = await this.sendQuery(auth_query)

      if (response.status==200){

        const pics = await this.getAvailableNfts();
        this.candidate_nfts = pics;
        this.nft_authorized = true;

      } else {
        console.log(response)
        alert('error')
      }

    },

    async getAvailableNfts() {

      const s = this.normalized_selected_nft

      const get_query =
      `
      query{
        showUnseenNfts(user:"${this.main_account}", collectionAddress:"${s.collectionAddress}", tokenId: "${s.tokenId}") {
          picUrl
          chainId
          collectionName
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

  .account_title {
    font-size: 14px;
    color: #afafaf;
  }

  .select_title {
    margin-top: 50px;
    padding-left: 40px;
  }

  .nft_unit {
    display: flex;
    align-items: center;
    height: 100px;
    cursor: pointer;
    padding: 20px 0 20px 80px;
  }

  .selected_nft {
    background-color: #dde;
  }

  .nft_image {
    height: 100px;
    margin-right: 15px;
  }

  .nft_label {
    cursor: pointer;
  }

  .select_btn_block {
    padding: 25px 0 0 40px;
  }

  .select_btn {
    height: 50px;
    font-size: 20px;
    padding: 5px 50px;
    background-color: green;
    font-weight: bold;
    color: #fff;
    cursor: pointer;
  }

  .select_label {
    font-size: 14px;
    color: #6464d0;
  }
}
</style>
