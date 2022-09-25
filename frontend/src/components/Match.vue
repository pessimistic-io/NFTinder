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

export default {
  name: 'Match',

  props: {
    user_nft: {},
    liked_nft: {},
  },

  methods: {
    swap() {

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
