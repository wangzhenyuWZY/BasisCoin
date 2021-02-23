<template>
    <div class="boardRoomContainer">
        <div class="stakePanel">
            <div class="pairLogo">
                <img src="@/assets/images/icon_OPB.png">
            </div>
            <h2 class="earns">{{earnedBalance}}</h2>
            <p class="earnTip">Open Share Earned</p>
            <el-button :loading="settleing" :disabled="settleing || earnedBalance==0" @click="withdrawOps">Settle</el-button>
        </div>
        <div class="stakePanel">
            <div class="pairLogo">
                <img src="@/assets/images/pairLogo2.png">
                <img src="@/assets/images/pairLogo1.png">
            </div>
            <h2 class="earns">{{stakeBalance}}</h2>
            <p class="earnTip">{{pairObj.stakeName}} Staked</p>
            <el-button @click="checkAppreve" :loading="approveding" :disabled="approveding">{{isAppreved?'Deposit':'Approve '+pairObj.stakeName}}</el-button>
        </div>
    </div>
</template>
<script>
import {PAIRLP,Cash,Share} from '../api/deployments/deployments.mainnet';
import {Decimals,Allowance,Approved} from '../utils'
import BigNumber from 'bignumber.js'
import {pair} from '@/utils/tokenPair'
import {getStore} from '@/config/utils'
export default {
    data() {
        return {
           pairObj:{},
           isAppreved:false,
           stakeBalance:0,
           earnedBalance:0
        }  
    },
    props:['lptAddress','approveding','settleing'],
    watch: {
        lptAddress(val) {
            console.log('lptAddress======'+val)
            this.getStakeBalance()
            this.getAllowance()
        }
    },
    created(){
        let pairname = this.$route.query.pair
        let pairObj = pair.filter((res)=>{return res.name==pairname})
        this.pairObj = pairObj[0]
        if(this.lptAddress){
            this.getStakeBalance()
            this.getAllowance()
        }
        this.getEarnedBalance()
    },
    methods:{
        getAllowance(){
            let that = this
            let contract = {
                address:that.lptAddress,
                abi:PAIRLP.abi
            }
            Allowance(contract,this.pairObj.pool.address).then(res=>{
                if(parseInt(res)==0){
                    that.isAppreved = false
                }else{
                    that.isAppreved = true
                }
            })
        },
        getStakeBalance(){
            let that = this
            Decimals(PAIRLP.abi,this.lptAddress).then(res=>{
                that.lpDecimals = res
                const contract = new web3.eth.Contract(that.pairObj.pool.abi, that.pairObj.pool.address)
                console.log(getStore('defaultAccout'))
                contract.methods.balanceOf(getStore('defaultAccout')).call().then((result)=>{
                    let balance = new BigNumber(result)
                    balance = balance.div(Math.pow(10,res))
                    that.stakeBalance=balance.toFixed(6)
                })
            })
        },
        getEarnedBalance(){
            let that = this
            Decimals(Share.abi,Share.address).then(res=>{
                that.opsDecimals = res
                const contract = new web3.eth.Contract(that.pairObj.pool.abi, that.pairObj.pool.address)
                contract.methods.earned(getStore('defaultAccout')).call().then((result)=>{
                    let balance = new BigNumber(result)
                    balance = balance.div(Math.pow(10,res))
                    that.earnedBalance=balance.toFixed(6)
                })
            })
        },
        checkAppreve(){
            let that = this
            if(this.isAppreved){
                this.$emit('showPurchase')
            }else{
                this.$emit('changeApproved',true)
                Approved(PAIRLP.abi,this.lptAddress,this.pairObj.pool.address).then(res=>{
                    if(res.status){
                        that.isAppreved = true
                        that.$emit('changeApproved',false)
                        that.getAllowance()
                    }
                })
            }
        },
        withdrawOps(){
            this.$emit('showWithdraw')
        }
    }
}
</script>
<style lang="less" scoped>
.boardRoomContainer{
    text-align:center;
    padding-top: 40px;
    .stakePanel{
        width: 320px;
        height: 400px;
        background: #171925;
        box-shadow: 16px 16px 28px 0px rgba(21, 22, 25, 0.95), -16px -16px 24px 0px #272B3B;
        padding:0 23px;
        box-sizing: border-box;
        margin:0 40px;
        display:inline-block;
        vertical-align: middle;
        border-radius:10px;
        &:first-child{
            .pairLogo{
                img{
                   &:first-child{right:0;left:0;} 
                }
            }
        }
        .pairLogo{
            text-align:center;
            padding-top:50px;
            padding-bottom:32px;
            height:50px;
            position:relative;
            img{
                position:relative;
                &:first-child{
                    right:-10px;
                }
                &:last-child{
                    left:-10px;
                }
            }
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
}
@media screen and (max-width: 750px) {
    .boardRoomContainer{
        .stakePanel{
            height:354px;
            margin-bottom:48px;
            .earns{
                font-size:32px;
                line-height:38px;
                padding-top:0;
            }
            .earnTip{
                padding-bottom:40px;
            }
        }
    }
}
</style>