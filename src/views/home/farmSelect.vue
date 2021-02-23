<template>
  <div class="container">
    <Navbar></Navbar>
    <div class="homeBody">
      <img src="@/assets/images/img_Earned.png">
      <h2 class="welcome">Earned {{pairObj.deposit}} by {{pairObj.name}}</h2>
      <p class="tips">Deposit {{pairObj.stakeName}}  and earn Share</p>
      <FarmSelect :settleing='settleing' :approveding='approveding' @changeApproved='changeApproved' @showPurchase="deposted" @showWithdraw='withdraw' :lptAddress='lptAddress'></FarmSelect>
      <BtmNav></BtmNav>
      <p class="toSwap">Provide liquidity to {{pairObj.uniPiar}} pair on Uniswap</p>
      <el-button class="setBtn" :loading="exiting" :disabled="exiting" @click="exit">Settle & Withdraw</el-button>
    </div>
    <Purchase v-show="isPurchase" :title="title" :pair='pairObj' :lptAddress='lptAddress' @cancelPop="isPurchase=false" @confirmPop='confirmPop'></Purchase>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar'
import BtmNav from '@/components/BtmNav'
import FarmSelect from '@/components/FarmSelect'
import Purchase from '@/components/Purchase'
import {pair} from '@/utils/tokenPair'
import BigNumber from 'bignumber.js'
import {getStore} from '@/config/utils'
import {Decimals} from '../../utils'
import {PAIRLP} from '../../api/deployments/deployments.mainnet';
export default {
  components:{
    Navbar,
    FarmSelect,
    BtmNav,
    Purchase,
  },
  data() {
    return {
      isPurchase:false,
      pairObj:{},
      lptAddress:'',
      title:'',
      isWithdraw:false,
      withdrawObj:{},
      stakeBalance:0,
      approveding:false,
      settleing:false,
      exiting:false
    }  
  },
  created(){
    
  },
  mounted(){
    let pairname = this.$route.query.pair
    let pairObj = pair.filter((res)=>{return res.name==pairname})
    this.pairObj = pairObj[0]
    this.getLpAddress()
  },
  methods:{
    getStakeBalance(){
        let that = this
        Decimals(PAIRLP.abi,this.lptAddress).then(res=>{
            const contract = new web3.eth.Contract(that.pairObj.pool.abi, that.pairObj.pool.address)
            contract.methods.balanceOf(getStore('defaultAccout')).call().then((result)=>{
                that.stakeBalance=result
            })
        })
    },
    changeApproved(flag){
      this.approveding = flag
    },
    deposted(){
      this.title = 'Deposit'
      this.isPurchase=true
    },
    withdraw(){
      this.title = 'Settle'
      this.isPurchase=true
    },
    confirmPop(num){
      let that = this
      this.isPurchase=false
      if(this.title=='Deposit'){
        this.approveding = true
        const contract = new web3.eth.Contract(this.pairObj.pool.abi, this.pairObj.pool.address)
        contract.methods.stake(num).send({from:getStore('defaultAccout')}).then((res)=>{
            if(res.status){
              that.$message({
                message: '质押成功',
                type: 'success'
              })
            }
            that.approveding = false
            window.location.reload()
        }).catch(function(error) {
          that.approveding = false
        });
      }else{
        this.confirmWithdraw(num)
      }
    },
    confirmWithdraw(num){
      let that = this
      this.settleing = true
      web3.eth.getGasPrice().then((result) => {
          const contract = new web3.eth.Contract(this.pairObj.pool.abi, this.pairObj.pool.address,{gas: 135415,gasPrice: result})
          contract.methods.withdraw(num).send({from:getStore('defaultAccout')}).then((res)=>{
              if(res.status){
                that.$message({
                  message: '移除质押成功',
                  type: 'success'
                })
                window.location.reload()
              }
              that.settleing = false
          }).catch(function(error) {
            that.settleing = false
          });
      })
    },
    getLpAddress(){
        let that = this
        const contract = new web3.eth.Contract(this.pairObj.pool.abi, this.pairObj.pool.address)
        contract.methods.lpt().call().then((res)=>{
            that.lptAddress = res
            that.getStakeBalance()
        })
    },
    exit(){
      let that = this
      const contract = new web3.eth.Contract(this.pairObj.pool.abi, this.pairObj.pool.address)
      this.exiting = true
      if(that.stakeBalance>0){
        contract.methods.exit().send({from:getStore('defaultAccout')}).then((res)=>{
            if(res.status){
              that.$message({
                message: '提现成功',
                type: 'success'
              })
              window.location.reload()
            }
            that.exiting = false
        }).catch(function(error) {
          that.exiting = false
        });
      }else{
        contract.methods.getReward().send({from:getStore('defaultAccout')}).then((res)=>{
            if(res.status){
              that.$message({
                message: '提现成功',
                type: 'success'
              })
              window.location.reload()
            }
            that.exiting = false
        }).catch(function(error) {
          that.exiting = false
        });
      }
      
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./index.less');
.setBtn{
    width: 274px;
    height: 56px;
    background: #171925;
    box-shadow: 8px 8px 20px 0px rgba(21, 22, 25, 0.95), -8px -8px 20px 0px #272B3B;
    border-radius: 12px;
    margin:0 auto 70px;
    line-height:56px;
    text-align:center;
    font-size:16px;
    color:#18C671;
    cursor: pointer;
    border: none;
    padding: 0;
    &.is-disabled{background: none;}
}
.toSwap{
  width:360px;
  font-size:16px;
  color:#E21C79;
  line-height:24px;
  text-align:center;
  padding-left:28px;
  background: url(../../assets/images/img_uni.png) no-repeat center left;
  background-size:24px 24px;
  margin:70px auto 32px;
  cursor: pointer;
}
@media screen and (max-width: 750px) {
  .toSwap{
    width:300px;
    font-size:13px;
  }
}
</style>