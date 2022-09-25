<template>
  <div :class="$style.Slider">
    <CardInfo :nft="queue[0]"/>
    <div :class="$style.decision_block">
      <button @click="handleDecision('like')" :class="[$style.like_button, $style.decision_button]">Like</button>
      <button @click="handleDecision('dislike')" :class="[$style.dislike_button, $style.decision_button]">Nope</button>
    </div>
  </div>
</template>
<script>
import CardInfo from '@/components/CardInfo';

export default {
  name: 'Slider',

  components: {
    CardInfo,
  },

  data: () => {
    return {
      queue: Array(0),
      liked_nfts: Array(0),
    }
  },

  computed: {
    current() {return this.queue[0]}
  },

  props: {
    candidate_nfts: Array(0),
    selected: {}
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
      if(this.queue.length > 1) {
        this.queue = this.queue.slice(1);
      }
    },

    async sendLike() {

      const q =
      `mutation{
        likeNft(likeInput:{
          liker_collection_address: "${this.$props.selected.collectionAddress}",
          liker_token_id: "${this.$props.selected.tokenId}",
          liked_collection_address: "${this.current.collectionAddress}",
          liked_token_id: "${this.current.tokenId}"
        }) {
          collectionName
          picUrl
          }
        }`

      // console.log(q)
      const r = await this.sendQuery(q)
      // console.log(r)

    },

    async sendDislike() {

      const q =
      `mutation{
        dislikeNft(dislikeInput:{
          disliker_collection_address: "${this.$props.selected.collectionAddress}",
          disliker_token_id: "${this.$props.selected.tokenId}",
          disliked_collection_address: "${this.current.collectionAddress}",
          disliked_token_id: "${this.current.tokenId}"
        }) {
          collectionName
          picUrl
          }
        }`

        const r = await this.sendQuery(q)

    }
  }
};

</script>
<style lang="scss" module>

.Slider {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .decision_img {
    height: 100%;
    width: 100%;
  }

  .decision_block {
    display: flex;
    justify-content: space-between;
  }

  .decision_button {
    width: 45%;
    height: 30px;
  }

  .like_button {
    margin-right: 10px;
  }
}

</style>
