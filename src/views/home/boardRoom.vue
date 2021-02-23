<template>
  <div class="container">
    <Navbar></Navbar>
    <div class="homeBody">
      <img src="@/assets/images/img_Earned.png">
      <h2 class="welcome">Join the Boardroom</h2>
      <p class="tips">Deposit Open Shares and inflationnary rewards</p>
      <BoardInfo></BoardInfo>
      <BoardRoomDiv @changeDeposition='changeDeposition' :claiming='claiming' :depositing='depositing' @showPurchase='withdraw' @claimReward='claimReward'></BoardRoomDiv>
      <LpBoardRoom @changeLpStatus='changeLpStakeStatus' :lpStakeStatus='lpStakeStatus' :claiming='lpClaiming' @depostLp='depostLp' @claimReward='claimRewardLp'></LpBoardRoom>
      <BtmNav></BtmNav>
      <!-- <el-button class="setBtn disabled" :loading="settleing" :disabled='settleing' @click="withdrawAndSettle">Settle & Withdraw</el-button> -->
      <Purchase v-show="isPurchase" :title='title' :pair='pairObj' :lptAddress='lptAddress' @cancelPop="isPurchase=false" @confirmPop='confirmPop'></Purchase>
      <LpPurchase v-show="isLpPurchase" :title='lpTitle' @cancelPop="isLpPurchase=false" @confirmPop='confirmDepositLp'></LpPurchase>
    </div>
  </div>
</template>
<script>
import {Share,Boardroom,LpBoardroom} from '@/api/deployments/deployments.mainnet';
import Navbar from '@/components/Navbar'
import BtmNav from '@/components/BtmNav'
import BoardRoomDiv from '@/components/BoardRoom'
import LpBoardRoom from '@/components/LpBoardRoom'
import BoardInfo from '@/components/BoardInfo'
import Purchase from '@/components/Purchase'
import LpPurchase from '@/components/LpPurchase'
import {getStore} from '@/config/utils'

export default {
  components:{
    Navbar,
    BoardRoomDiv,
    LpBoardRoom,
    BtmNav,
    BoardInfo,
    Purchase,
    LpPurchase
  },
  data() {
    return {
      isPurchase:false,
      isLpPurchase:false,
      pairObj:{
          name:'OPS'
      },
      lptAddress:Share.address,
      title:'',
      lpTitle:'',
      depositing:false,
      claiming:false,
      lpClaiming:false,
      settleing:false,
      lpStakeStatus:false
    }  
  },
  created(){
      
  },
  methods:{
    changeLpStakeStatus(flag){
      this.lpStakeStatus = flag
    },
    changeDeposition(flag){
      this.depositing = flag
    },
    depostLp(){
      this.lpTitle = 'Deposit'
      this.isLpPurchase = true
    },
    withdraw(t){
        this.title = 'Deposit'
        this.isPurchase = true
    },
    confirmDepositLp(num){
        let that = this
        this.lpStakeStatus = true
        this.isLpPurchase=false
        const contract = new web3.eth.Contract(LpBoardroom.abi, LpBoardroom.address)
        contract.methods.stake(num).send({from:getStore('defaultAccout')}).then((res)=>{
            if(res.status){
                that.$message({
                    message: '质押成功',
                    type: 'success'
                })
                window.location.reload()
            }
            that.lpStakeStatus = false
        }).catch(function(error) {
          that.lpStakeStatus = false
        });
    },
    claimRewardLp(){
      let that = this
      this.lpClaiming = true
      const contract = new web3.eth.Contract(LpBoardroom.abi, LpBoardroom.address)
      contract.methods.claimReward().send({from:getStore('defaultAccout')}).then((res)=>{
          if(res.status){
              that.$message({
                  message: '提取收益成功',
                  type: 'success'
              })
              window.location.reload()
          }
          that.lpClaiming = false
      }).catch(function(error) {
        that.lpClaiming = false
      });
    },
    confirmPop(num){
        let that = this
        this.depositing = true
        that.isPurchase=false
        const contract = new web3.eth.Contract(Boardroom.abi, Boardroom.address)
        contract.methods.stake(num).send({from:getStore('defaultAccout')}).then((res)=>{
            if(res.status){
                that.$message({
                    message: '质押成功',
                    type: 'success'
                })
                window.location.reload()
            }
            that.depositing = false
        }).catch(function(error) {
          that.depositing = false
        });
    },
    claimReward(){
      let that = this
      this.claiming = true
      const contract = new web3.eth.Contract(Boardroom.abi, Boardroom.address)
      contract.methods.claimReward().send({from:getStore('defaultAccout')}).then((res)=>{
          if(res.status){
              that.$message({
                  message: '提取收益成功',
                  type: 'success'
              })
              window.location.reload()
          }
          that.claiming = false
      }).catch(function(error) {
        that.claiming = false
      });
    },
    // withdrawAndSettle(){
    //   let that = this
    //   this.settleing = true
    //   const contract = new web3.eth.Contract(Boardroom.abi, Boardroom.address)
    //   contract.methods.exit().send({from:getStore('defaultAccout')}).then((res)=>{
    //     if(res.status){
    //         that.$message({
    //             message: '提取收益成功',
    //             type: 'success'
    //         })
    //     }
    //     that.settleing = false
    //   }).catch(function(error) {
    //     that.settleing = false
    //   });
    // }
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
    margin:70px auto;
    line-height:56px;
    text-align:center;
    font-size:16px;
    color:#18C671;
    cursor: pointer;
    &.disabled{
        color:#343747;
    }
    border: none;
    padding: 0;
    &.is-disabled{background: none;}
}
</style>