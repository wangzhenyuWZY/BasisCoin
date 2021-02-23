<!-- home -->
<template>
  <div class="container">
    <Navbar></Navbar>
    <div class="homeBody">
      <img src="@/assets/images/img_Earned.png">
      <h2 class="welcome">Welcome to Open Cash!</h2>
      <p class="tips">Buy, sell, and provide liquidity for Open Cash and Open Shares on Uniswap</p>
      <Product></Product>
      <BtmNav></BtmNav>
      <MyWallet v-show="false"></MyWallet>
      <Transiction v-show="false"></Transiction>
      <TransiCallback v-show="false"></TransiCallback>
    </div>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar'
import BtmNav from '@/components/BtmNav'
import Product from '@/components/Product'

import TransiCallback from '@/components/TransiCallback'

export default {
  components:{
    Navbar,
    Product,
    BtmNav,
    TransiCallback
  },
  data() {
    return {

    }
  },
  computed: {},
  created(){
    
  },
  methods:{
    
  },
  mounted() { 
     
  }
}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
