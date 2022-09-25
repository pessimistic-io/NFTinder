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

  props: {
    candidate_nfts: Array(0),
    user: ''
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

      // console.log(this.queue[0])



      // const q =
      // `mutation{
      //   likeNft(nftOwnId: "${this.$props.user}", nftLikeId: "${this.queue[0]._id}"){_id}}
      // }
      // `

      // console.log(q)
      // const r = await this.sendQuery(q)
      // console.log(r)

    },

    async sendDislike() {

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
