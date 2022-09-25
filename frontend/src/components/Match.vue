<template>
  <div :class="$style.Match">
    <h1 :class="$style.title">It's a match!</h1>
    <div :class="$style.nfts">
      <div :class="$style.nft_info">
        <div :class="$style.nft_wrapper">
          <img :class="$style.nft_img" :src="user_nft.imageUrl" alt=""/>
        </div>
        <p :class="$style.nft_label">{{ user_nft.name }}</p>
      </div>
      <div :class="$style.nft_info">
        <div :class="$style.nft_wrapper">
          <img :class="$style.nft_img" :src="liked_nft.picUrl" alt=""/>
        </div>
        <p :class="$style.nft_label">{{ liked_nft.collectionName + " #" + liked_nft.tokenId }}</p>
      </div>
    </div>
    <button :class="$style.button" @click="swap">
      Confirm swap
    </button>
  </div>
</template>
<script>

import { ethers } from 'ethers';

export default {
  name: 'Match',

  props: {
    user_nft: {},
    liked_nft: {},
  },

  data: () => {
    return {
      provider: {},
    }
  },

  async created() {

    this.provider = new ethers.providers.Web3Provider(window.ethereum)
  },

  methods: {

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


    async swap() {

      // const contract = new ethers.Contract(
      //   process.env.VUE_APP_NFTINDER_ADDRESS,
      //   ["function swap(uint index, Lib.Order order, bytes signature)"],
      //   this.provider
      // ).connect(this.provider.getSigner())

      const q =
      `query{
        getSignature(collectionAddress: "${this.liked_nft.collectionAddress}", tokenId:"${this.liked_nft.tokenId}")
      }
      `
      // console.log(q)

      const sq = await this.sendQuery(q)

      const data_s = await sq.json()

      const sign = data_s.data.getSignature;

      if (!sign) {
        console.log('signature not found!')
        return;
      }

      const {message, sig} = JSON.parse(sign)

      const {nfts, nft} = message;

      // console.log(message)
      // console.log(sig)

      let index = null
      for (let i=0;i<nfts.length;i++){

        if (nfts[i].collection == this.user_nft.collectionAddress
          && nfts[i].tokenId == this.user_nft.collectionTokenId) {
          index = i ; break
        }
      }

      if (index===null) {
        console.log('signature not found');return;
      }

      return this._swap(index, message, sig)

    },

    async _swap(index, message, sig) {

      const NFTINDER_ABI = [{"inputs":[{"components":[{"components":[{"internalType":"address","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Lib.NFT","name":"nft","type":"tuple"},{"components":[{"internalType":"address","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Lib.NFT[]","name":"nfts","type":"tuple[]"}],"internalType":"struct Lib.Order","name":"order","type":"tuple"}],"name":"hash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"components":[{"components":[{"internalType":"address","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Lib.NFT","name":"nft","type":"tuple"},{"components":[{"internalType":"address","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Lib.NFT[]","name":"nfts","type":"tuple[]"}],"internalType":"struct Lib.Order","name":"order","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"swap","outputs":[],"stateMutability":"nonpayable","type":"function"}]

      const NFTinder = process.env.VUE_APP_NFTINDER_ADDRESS
      const contract = new ethers.Contract(NFTinder, NFTINDER_ABI, this.provider)
          .connect(this.provider.getSigner())

      const indexHex = await ethers.BigNumber.from(index.toString()).toHexString();
      const res = await contract.swap(indexHex, message, sig);
    }
  }
};

</script>
<style lang="scss" module>

.Match {
  width: 400px;
  padding: 25px 20px;
  background-color: silver;
  box-shadow: 0 0 0 3px silver, 1em 1em 3px 0 rgb(0 0 0 / 50%);
  border: 6px double #fff;
  margin: 150px auto;

  .title {
    font-style: italic;
    color: green;
    text-align: center;
  }

  .nfts {
    display: flex;
    justify-content: space-between;
  }

  .nft_info {
    width: 45%;
  }

  .nft_wrapper {
    width: 100%;
    height: 200px;
    position: relative;
    overflow: hidden;
  }

  .nft_img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  .nft_label {
    overflow: hidden;
  }

  .button {
    width: 100%;
    font-size: 18px;
    color: #fff;
    background-color: green;
    padding: 8px 0;
    margin-top: 20px;
  }
}

</style>
