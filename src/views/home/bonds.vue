<template>
  <div class="container">
    <Navbar></Navbar>
    <div class="homeBody">
      <img src="@/assets/images/img_Earned.png">
      <h2 class="welcome">BUY & Redeem Bonds</h2>
      <p class="tips">Earn Premiuums upon redemption</p>
      <Bonds @changeApprovedopc='changeApprovedopc' @changeApprovedopb='changeApprovedopb' :approvedOpc='approvedOpc' :approvedOpb='approvedOpb'  @showPurchase='buyOrRedeem'></Bonds>
      <BtmNav></BtmNav>
      <Purchase v-show="isPurchase" :title="title" :pair='pairObj' :lptAddress='lptAddress' @cancelPop="isPurchase=false" @confirmPop='confirmPop'></Purchase>
    </div>
  </div>
</template>
<script>
import {Cash,Share,Bond,Treasury} from '../../api/deployments/deployments.mainnet';
import Navbar from '@/components/Navbar'
import BtmNav from '@/components/BtmNav'
import Bonds from '@/components/Bonds'
import Purchase from '@/components/Purchase'
import {getStore} from '@/config/utils'
export default {
  components:{
    Navbar,
    Bonds,
    BtmNav,
    Purchase
  },
  data() {
    return {
      title:'',
      isPurchase:false,
      pairObj:{
        name:'OPC'
      },
      lptAddress:'',
      opcPrice:0,
      approvedOpc:false,
      approvedOpb:false
    }  
  },
  created(){
    
  },
  mounted(){
    this.getOpcPrice()
  },
  methods:{
    changeApprovedopc(flag){
      this.approvedOpc = flag
    },
    changeApprovedopb(flag){
      this.approvedOpb = flag
    },
    buyOrRedeem(type){
      this.isPurchase = true
      this.type = type
      if(this.type=='buy'){
        this.lptAddress = Cash.address
        this.pairObj.name = 'OPC'
        this.title = 'Purchase'
      }else{
        this.title = 'Redeem'
        this.lptAddress = Bond.address
        this.pairObj.name = 'OPB'
      }
    },
    confirmPop(num){
      let that = this
      this.isPurchase = false
      if(this.type=='buy'){
        this.approvedOpc = true
        const contract = new web3.eth.Contract(Treasury.abi, Treasury.address)
        contract.methods.buyBonds(num,this.opcPrice).send({from:getStore('defaultAccout')}).then((res)=>{
          if(res.status){
            that.$message({
              message: '成功',
              type: 'success'
            })
          }
          that.approvedOpc = false
        }).catch(function(error) {
          that.approvedOpc = false
        });
      }else if(this.type=='redeem'){
        this.approvedOpb = true
        const contract = new web3.eth.Contract(Treasury.abi, Treasury.address)
        contract.methods.redeemBonds(num,this.opcPrice).send({from:getStore('defaultAccout')}).then((res)=>{
          if(res.status){
            that.$message({
              message: '成功',
              type: 'success'
            })
          }  
          that.approvedOpb = false
        }).catch(function(error) {
          that.approvedOpb = false
        });
      }
    },
    getOpcPrice(){
        let that = this
        const contract = new web3.eth.Contract(Treasury.abi, Treasury.address)
        contract.methods.getBondOraclePrice().call().then((result)=>{
            that.opcPrice = result
        })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>