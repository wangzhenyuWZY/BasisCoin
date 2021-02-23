<template>
    <div class="boardRoomContainer">
        <div class="stakeWrap clearfix">
            <div class="stakePanel fl">
                <img src="@/assets/images/OPC.png">
                <h2 class="earns">{{parseFloat(earnedBalance).toFixed(4)}}</h2>
                <p class="earnTip">Open Cash Earned</p>
                <el-button :loading="lpClaiming" :disabled='lpClaiming' @click="claimReward">Claim Reward</el-button>
            </div>
            <div class="stakePanel fr">
                <div class="pairLogo">
                    <img src="@/assets/images/pairLogo2.png">
                    <img src="@/assets/images/pairLogo1.png">
                </div>
                <h2 class="earns">{{parseFloat(stakeLpBalance).toFixed(4)}}</h2>
                <p class="earnTip">OPS-DAI-LP</p>
                <div class="unlocktime">
                    <p>Unlock After</p>
                    <div class="downtime">{{hou}}:{{min}}:{{sec}}</div>
                </div>
                <el-button :loading="lpStakeStatus" :disabled='lpStakeStatus' @click="checkLpAppreve">{{lpIsApproved?'Deposit':'Approve OPS-DAI-LP'}}</el-button>
            </div>
            <el-button class="setBtn" :class="isExid?'disabled':''" :loading="settleing" :disabled='isExid' @click="exit">Settle & Withdraw</el-button>
        </div>
    </div>
</template>
<script>
import {Cash,LpBoardroom,PAIRLP,DAIOPSPool,DAITOKEN} from '../api/deployments/deployments.mainnet';
import {Decimals,Allowance,Approved} from '../utils'
import BigNumber from 'bignumber.js'
import {pair} from '@/utils/tokenPair'
import {getStore} from '@/config/utils'
export default {
    data() {
        return {
           earnedBalance:0,
           lptAddress:'',
           stakeLpBalance:0,
           lpIsApproved:false,
           endTime:'',
           hou:0,
           min:0,
           sec:0,
           isExid:true,
           settleing:false,
           lpDecimails:18
        }  
    },
    props:['lpStakeStatus','lpClaiming'],
    created(){
        this.getLpAddress()
        this.getStakeLpBalance()
        this.getEndTime()
        this.getEarnedBalance()
    },
    methods:{
        getEndTime(){
            let that = this
            const contract = new web3.eth.Contract(LpBoardroom.abi, LpBoardroom.address)
            contract.methods.getCanWithdrawTime(getStore('defaultAccout')).call().then((res)=>{
                that.endTime = res
                that.setDownTime()
            })
        },
        setDownTime(){
            var lpInterval = window.setInterval(() => {
                let nowTime = parseInt(new Date().getTime()/1000)
                let endTime = parseInt(this.endTime)*1000
                var date=(new Date(endTime)) - (new Date());
                if (date > 0) {
                    this.isExid = true
                    let time = date / 1000;
                    // 获取时、分、秒,毫秒
                    this.hou = parseInt((time % (60 * 60 * 24)) / 3600)<10?('0'+parseInt((time % (60 * 60 * 24)) / 3600)):parseInt((time % (60 * 60 * 24)) / 3600)
                    this.min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)<10?('0'+parseInt(((time % (60 * 60 * 24)) % 3600) / 60)):parseInt(((time % (60 * 60 * 24)) % 3600) / 60);
                    this.sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)<10?('0'+parseInt(((time % (60 * 60 * 24)) % 3600) % 60)):parseInt(((time % (60 * 60 * 24)) % 3600) % 60);
                }else{
                    clearInterval(lpInterval)
                    if(this.stakeLpBalance>0){
                        this.isExid = false
                    }
                }
            },1000)
        },
        exit(){
            let that = this
            this.settleing = true
            const contract = new web3.eth.Contract(LpBoardroom.abi, LpBoardroom.address)
            let balance = new BigNumber(this.stakeLpBalance)
            balance = balance.times(Math.pow(10,this.lpDecimails))
            contract.methods.withdraw(balance.toFixed()).send({from:getStore('defaultAccout')}).then((res)=>{
                if(res.status){
                    that.$message({
                        message: '提现成功',
                        type: 'success'
                    })
                    window.location.reload()
                }
                that.settleing = false
            }).catch(function(error) {
                that.settleing = false
            });
        },
        getLpAddress(){
            let that = this
            const contract = new web3.eth.Contract(DAIOPSPool.abi, DAIOPSPool.address)
            contract.methods.lpt().call().then((res)=>{
                that.lptAddress = res
                that.getLpAllowance()
            })
        },
        getAllowance(){
            let that = this
            Allowance(Share,Boardroom.address).then(res=>{
                if(parseInt(res)==0){
                    that.isAppreved = false
                }else{
                    that.isAppreved = true
                }
            })
        },
        getLpAllowance(){
            let that = this
            let contract = {
                address:that.lptAddress,
                abi:PAIRLP.abi
            }
            Allowance(contract,LpBoardroom.address).then(res=>{
                if(parseInt(res)==0){
                    that.lpIsApproved = false
                }else{
                    that.lpIsApproved = true
                }
            })
        },
        getStakeLpBalance(){
            let that = this
            Decimals(DAITOKEN.abi, DAITOKEN.address).then(res=>{
                const contract = new web3.eth.Contract(LpBoardroom.abi, LpBoardroom.address)
                that.lpDecimails = res
                contract.methods.balanceOf(getStore('defaultAccout')).call().then((result)=>{
                    let balance = new BigNumber(result)
                    balance = balance.div(Math.pow(10,res))
                    that.stakeLpBalance=balance.toFixed()
                })
            })
        },
        getEarnedBalance(){
            let that = this
            Decimals(Cash.abi,Cash.address).then(res=>{
                that.opcDecimals = res
                const contract = new web3.eth.Contract(LpBoardroom.abi, LpBoardroom.address)
                contract.methods.earned(getStore('defaultAccout')).call().then((result)=>{
                    let balance = new BigNumber(result)
                    balance = balance.div(Math.pow(10,res))
                    that.earnedBalance=balance.toFixed()
                })
            })
        },
        checkLpAppreve(){
            let that = this
            if(this.lpIsApproved){
                this.$emit('depostLp')
            }else{
                that.$emit('changeLpStatus',true)
                Approved(PAIRLP.abi,that.lptAddress,LpBoardroom.address).then(res=>{
                    if(res.status){
                        that.lpIsApproved = true
                        that.$emit('changeLpStatus',false)
                    }
                })
            }
        },
        claimReward(){
            this.$emit('claimReward')
        }
    }
}
</script>
<style lang="less" scoped>
.fl{
    float:left;
}
.fr{
    float:right;
}
.boardRoomContainer{
    text-align:center;
    padding-top: 40px;
    margin-bottom:40px;
    .stakeWrap{
        width:730px;
        margin:0 auto;
        background: #171925;
        box-shadow: 16px 16px 28px 0px rgba(21, 22, 25, 0.95), -16px -16px 24px 0px #272B3B;
        border-radius:10px;
    }
    .stakePanel{
        position:relative;
        width: 320px;
        height: 400px;
        padding:0 23px;
        box-sizing: border-box;
        display:inline-block;
        vertical-align: middle;
        margin:0 15px;
        .unlocktime{
            position:absolute;
            width:100%;
            top:230px;
            left:0;
            color:rgba(255, 255, 255, 0.9);
        }
        .pairLogo{
            text-align:center;
            padding-bottom:32px;
            img{
                width:44px;
                position:relative;
                &:first-child{
                    right:-10px;
                }
                &:last-child{
                    left:-10px;
                }
            }
        }
        img{
            width:72px;
            padding-top:48px;
        }
        .earns{
            font-size:48px;
            color:#fff;
            line-height:57px;
            text-align:center;
            padding-top:12px;
        }
        .earnTip{
            font-size:16.56px;
            color:rgba(255,255,255,0.6);
            line-height:100%;
            padding-top:6px;
            padding-bottom:70px;
        }

    }
}
.el-button{
    background:none;
    border:1px solid #18C671;
    color:#18C671;
    text-align:center;
    font-size:16px;
    width: 100%;
    height: 56px;
    border-radius: 12px;
    &:hover{background:none;}
    &.disabled{
        border: 1px solid #343747;
        color:#343747;
    }
}
.setBtn{
    width: 274px;
    height: 56px;
    background: #171925;
    box-shadow: 8px 8px 20px 0px rgba(21, 22, 25, 0.95), -8px -8px 20px 0px #272B3B;
    border-radius: 12px;
    margin:0px auto 30px;
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
@media screen and (max-width: 750px) {
    .boardRoomContainer{
        padding-top:16px;
        .stakeWrap{
            width:350px;
        }
        .stakePanel{
            height:350px;
            margin-bottom:32px;
            img{
                width:80px;
                padding-top:36px;
            }
            .earns{
                font-size:32px;
                line-height:38px;
            }
            .earnTip{
                font-size:16px;
                padding-bottom:76px;
            }
            .unlocktime{
                top:200px;
            }
        }
    }
}
</style>