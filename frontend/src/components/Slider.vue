<template>
  <div>
    <div v-if="!matched" :class="$style.Slider">
      <div :class="$style.card">
        <!--   Show a card if the pool is not empty -->
        <div v-if="queue.length !== 0">
          <CardInfo :nft="queue[0]"/>
          <div :class="$style.decision_block">
            <button @click="handleDecision('like')" :class="[$style.like_button, $style.decision_button]">Like</button>
            <button @click="handleDecision('dislike')" :class="[$style.dislike_button, $style.decision_button]">Nope</button>
          </div>
        </div>
        <h3 v-else>NFT pool is empty</h3>

        <button v-if="liked_nfts.length !== 0"
                :class="$style.sign_btn"
                @click="signNewLikes"
        >Sign likes</button>
      </div>
    </div>
    <Match
      v-else
      :user_nft="user_nft"
      :liked_nft="matched_nft"
    />
  </div>
</template>
<script>
import CardInfo from '@/components/CardInfo';
import Match from '@/components/Match';
import { ethers } from 'ethers';

export default {
  name: 'Slider',

  components: {
    Match,
    CardInfo,
  },

  data: () => {
    return {
      queue: Array(0),
      liked_nfts: Array(0),
      likes_sig: "",
      matched: false,
      matched_nft: {},
    }
  },

  computed: {
    current() {return this.queue[0]}
  },

  props: {
    candidate_nfts: Array(0),
    provider: {},
    user_nft: {},
    main_account: "",
  },

  created() {
    this.updateQueue();
  },

  methods: {
    updateQueue() {
      this.queue = this.$props.candidate_nfts;
    },

    async handleDecision(decision) {
      if(decision === "like") {
        await this.sendLike();

        await this.fetchMatch();
      }
      else {
        await this.sendDislike();
      }
      this.cutQueue();
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

    cutQueue() {
      // Delete 1st NFT
      this.queue = this.queue.length > 1 ? this.queue.slice(1) : [];
    },


    async fetchMatch() {

      const q=
      `query{
        findMatch(likeInput:{
          liker_collection_address: "${this.user_nft.collectionAddress}",
          liker_token_id: "${this.user_nft.collectionTokenId}",
          liked_collection_address: "${this.current.collectionAddress}",
          liked_token_id: "${this.current.tokenId}"
        }){
          picUrl
          chainId
          collectionName
          collectionAddress
          tokenId
          ownerWallet
        }
      }`

      const r = await this.sendQuery(q)

      const res = await r.json()

      const m = await res.data.findMatch

      // Have a match
      if (m) {
        this.matched = true;
        this.matched_nft = m;
        // console.log(m)

        // TODO: move call to the button
        await this.matchTx(this.user_nft, m)
      }

    },

    async sendLike() {

      const q =
      `mutation{
        likeNft(likeInput:{
          liker_collection_address: "${this.user_nft.collectionAddress}",
          liker_token_id: "${this.user_nft.collectionTokenId}",
          liked_collection_address: "${this.current.collectionAddress}",
          liked_token_id: "${this.current.tokenId}"
        }) {
            liker_collection_address
            liker_token_id
            liked_collection_address
            liked_token_id
          }
        }`

      const r = await this.sendQuery(q)

      // like queue[0]
      this.liked_nfts.push(this.queue[0]);
    },

    async sendDislike() {

      const q =
      `mutation{
        dislikeNft(dislikeInput:{
          disliker_collection_address: "${this.user_nft.collectionAddress}",
          disliker_token_id: "${this.user_nft.collectionTokenId}",
          disliked_collection_address: "${this.current.collectionAddress}",
          disliked_token_id: "${this.current.tokenId}"
        }) {
            disliker_collection_address
            disliker_token_id
            disliked_collection_address
            disliked_token_id
          }
        }`

        const r = await this.sendQuery(q)

    },

    async signNewLikes() {
      await this.signNfts(this.user_nft, this.liked_nfts);

      if(this.likesSigned()) {
        // TODO: отправить подпись
        this.liked_nfts = [];
        this.likes_sig = "";
      }
      else {
        // ничего
      }
    },

    likesSigned() {
      return Boolean(this.likes_sig);
    },

    /*
      nft - "selected nft" object.
      nfts - list of liked nfts from the database
    */
    async signNfts(nft, nfts) {
      const network = await this.provider.getNetwork()
      const domain = {
        name: 'NFTinder',
        version: '0.1',
        chainId: network.chainId,
        verifyingContract: process.env.VUE_APP_NFTINDER_ADDRESS
      }
      console.log(domain);

      const types = {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        NFT: [
          { name: 'collection', type: 'address' },
          { name: 'tokenId', type: 'uint256' }
        ],
        Order: [
          { name: 'nft', type: 'NFT' },
          { name: 'nfts', type: 'NFT[]' }
        ]
      }

      const message = {
        nft: {collection: nft.collectionAddress, tokenId: nft.collectionTokenId},
        nfts: []
      }
      message.nfts = nfts.map(function(nft) {return { collection: nft.collectionAddress, tokenId: nft.tokenId }})
      const primaryType = "Order"
      const TypedMessage = {
        domain,
        types,
        message,
        primaryType
      };

      const sig = await this.provider.send('eth_signTypedData_v4', [this.main_account, JSON.stringify(TypedMessage)]);
      this.likes_sig = sig;
      console.log("TypedMessage signature: %s", sig)
    },


    async matchTx(my, your) {
      // console.log("my:")
      // console.log(my)
      // console.log("your:")
      // console.log(your)


      // TODO: тут должно быть чтение подписи из базы
      const sig = "0x1234";
      const message = {
        nft: {collection: your.collectionAddress, tokenId: your.tokenId},
        nfts: [
          {collection: your.collectionAddress, tokenId: your.tokenId},
          {collection: my.collectionAddress, tokenId: my.collectionTokenId},
          {collection: your.collectionAddress, tokenId: your.tokenId}
        ]
      }
      const my_nft_is_ok = message.nft.collection === your.collectionAddress
          && message.nft.tokenId === your.tokenId
      if (!my_nft_is_ok) {
        console.log("Critical error: Wrong 'message' - message.nft is not what I want")
      }

      let index
      for (let i = 0; i < message.nfts.length; i++) {
        const n = message.nfts[i]
        
        if (n.collection === my.collectionAddress
            && n.tokenId === my.collectionTokenId) {
          index = i
          break;
        }
      }

      if (index === null) {
        console.log("Critical error: Didn't find my NFT in signed data")
      } 

      await this.swap(index, message, sig)
    },


    async swap(index, message, sig) {
      console.log(index)
      console.log(message)
      console.log(sig)

      const NFTINDER_ABI = [{"inputs":[{"components":[{"components":[{"internalType":"address","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Lib.NFT","name":"nft","type":"tuple"},{"components":[{"internalType":"address","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Lib.NFT[]","name":"nfts","type":"tuple[]"}],"internalType":"struct Lib.Order","name":"order","type":"tuple"}],"name":"hash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"components":[{"components":[{"internalType":"address","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Lib.NFT","name":"nft","type":"tuple"},{"components":[{"internalType":"address","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"struct Lib.NFT[]","name":"nfts","type":"tuple[]"}],"internalType":"struct Lib.Order","name":"order","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"swap","outputs":[],"stateMutability":"nonpayable","type":"function"}]

      const NFTinder = process.env.VUE_APP_NFTINDER_ADDRESS
      const contract = new ethers.Contract(NFTinder, NFTINDER_ABI, this.provider)
          .connect(this.provider.getSigner())

      const indexHex = await ethers.BigNumber.from(index.toString()).toHexString();     
      const res = await contract.swap(indexHex, message, sig);
      // if (res) {

      //   alert('success')
      // } else {
      //   // TODO
      // }
    },
  }
};

</script>
<style lang="scss" module>

.Slider {
  height: 350px;
  width: 200px;
  padding: 25px 20px;
  background-color: silver;
  box-shadow: 0 0 0 3px silver, 1em 1em 3px 0 rgb(0 0 0 / 50%);
  border: 6px double #fff;
  margin: 150px auto;

  .decision_img {
    height: 100%;
    width: 100%;
  }

  .decision_block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .decision_button {
    width: 45%;
    font-size: 20px;
    padding: 5px 0;
    cursor: pointer;
  }

  .like_button {
    margin-right: 10px;
    color: #fff;
    background-color: green;
  }

  .dislike_button {
    background-color: grey;
    color: #fff;
  }

  .sign_btn {
    width: 100%;
    font-size: 18px;
  }
}

</style>
