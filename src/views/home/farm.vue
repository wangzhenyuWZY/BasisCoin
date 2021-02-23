<template>
  <div class="container">
    <Navbar></Navbar>
    <div class="homeBody">
      <img src="@/assets/images/img_Farm.png">
      <h2 class="welcome">Pick a Farm</h2>
      <p class="tips"> Open Shares by providing liquidity</p>
      <Pair></Pair>
      <BtmNav></BtmNav>
    </div>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar'
import BtmNav from '@/components/BtmNav'
import Pair from '@/components/Pair'
export default {
  components:{
    Navbar,
    Pair,
    BtmNav
  },
}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>