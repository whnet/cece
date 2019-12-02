<template>
<div class="kefu" style="background:#fff">
  <img :src="kefu">
</div>
</template>

<script>
export default {
  name: 'kefu',
  data () {
    return {
      kefu: config.KEFU_IMG,
    }
  },
}
</script>

<style scoped>
  html {
    font-size: 20px;
    background:#fff!important;
  }
  .kefu img{
    position: absolute;
    top: 25%;
    width: 200px;
    height: 200px;
    left: 25%;
  }
</style>
