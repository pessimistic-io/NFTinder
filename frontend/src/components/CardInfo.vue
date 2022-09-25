<template>
  <div :class="$style.Card">
    <div :class="$style.imgBlock">
      <img :class="$style.image" :src="nft.picUrl" :alt="nft.name"/>
    </div>
    <h5 :class="$style.name_tag">{{ nft.name }}</h5>
  </div>
</template>
<script>

export default {
  name: 'CardInfo',

  props: {
    nft: {},
  }
};

</script>
<style lang="scss" module>

.Card {
  height: 280px;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: end;

  .imgBlock {
    overflow: hidden;
    height: 80%;
    margin-bottom: 10px;
  }

  .image {
    width: 100%;
  }

  .name_tag {

  }
}
</style>
