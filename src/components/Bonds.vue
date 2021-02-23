<template>
    <div class="bondContainer clearfix">
        <div class="bondPanel fl">
            <h2>Purchase Open Bond</h2>
            <div class="changebar">
                <div class="coin fr">
                    <img src="@/assets/images/icon_OPS.png">
                    <p>Open Bond</p>
                </div>
                <div class="coin fl">
                    <img src="@/assets/images/OPC.png">
                    <p>Open Cash</p>
                </div>
                <i class="changeico"></i>
            </div>
            <p class="price" v-show="opcPrice<1">{{Math.floor(100/opbPrice-100)}}% return when OPC>$1</p>
            <p class="price" v-show="opcPrice>1">OPC is over $1</p>
            <el-button :loading="approvedOpc" :disabled='approvedOpc || opcPrice>1'  :class="opcPrice>1?'disabled':''" class="btn" @click="checkAppreveOpc">{{isApprevedOpc?'Buy':'Approve OPC'}}</el-button>
        </div>
        <div class="changeInfo">
            <div class="infoItem">
                <div class="exchangeprice">
                    <i></i>
                    OPC=${{parseFloat(opcPrice).toFixed(2)}}
                </div>
                <p class="priceAlgo">Base Price (Last-Day TWAP)</p>
            </div>
            <div class="infoItem">
                <div class="exchangeprice">
                    <i></i>
                    OPB=${{parseFloat(opbPrice).toFixed(2)}}
                </div>
                <p class="priceAlgo">Current Price :(OPC)^2</p>
            </div>
        </div>
        <div class="bondPanel fr">
            <h2>Purchase Open Cash</h2>
            <div class="changebar">
                <div class="coin fr">
                    <img src="@/assets/images/OPC.png">
                    <p>Open Cash</p>
                </div>
                <div class="coin fl">
                    <img src="@/assets/images/icon_OPS.png">
                    <p>Open Bond</p>
                </div>
                <i class="changeico"></i>
            </div>
            <p class="price">{{opbBalance}} OPB Available</p>
            <el-button :loading="approvedOpb" :disabled='approvedOpb || opcPrice<1' class="btn" :class="opcPrice<1?'disabled':''" @click="checkAppreveOpb">{{isApprevedOpb?'Redeem':'Approve OPB'}}</el-button>
        </div>
    </div>
</template>
<script>
import {Cash,Share,Bond,Treasury,DAITOKEN} from '../api/deployments/deployments.mainnet';
import {Decimals,Allowance,Approved} from '../utils'
import BigNumber from 'bignumber.js'
import {getStore} from '@/config/utils'
export default {
    data() {
        return {
           isApprevedOpc:false,
           isApprevedOpb:false,
           opcPrice:0,
           opbPrice:0,
           opcDecimals:18,
           daiDecimals:18,
           opbDecimals:18,
           opbBalance:0
        }  
    },
    props:['approvedOpc','approvedOpb'],
    created(){
        
    },
    mounted(){
        this.getHomeInfo()
        this.getAllowance()
        this.getOpcPrice()
        this.getOpbBalance()
    },
    methods:{
        async getHomeInfo(){
            let that = this
            Decimals(Cash.abi, Cash.address).then(res=>{
                that.opcDecimals = res
            })
            Decimals(DAITOKEN.abi, DAITOKEN.address).then(res=>{
                that.daiDecimals = res
            })
            Decimals(Bond.abi, Bond.address).then(res=>{
                that.opbDecimals = res
            })
        },
        getAllowance(){
            let that = this
            Allowance(Bond,Treasury.address).then(res=>{
                if(parseInt(res)==0){
                    that.isApprevedOpb = false
                }else{
                    that.isApprevedOpb = true
                }
            })
            Allowance(Cash,Treasury.address).then(res=>{
                if(parseInt(res)==0){
                    that.isApprevedOpc = false
                }else{
                    that.isApprevedOpc = true
                }
            })
        },
        checkAppreveOpc(){
            let that = this
            if(this.isApprevedOpc){
                this.$emit('showPurchase','buy')
            }else{
                this.$emit('changeApprovedopc',true)
                Approved(Cash.abi,Cash.address,Treasury.address).then(res=>{
                    if(res.status){
                        that.isApprevedOpc = true
                        that.$emit('changeApprovedopc',false)
                        that.getAllowance()
                    }
                })
            }
        },
        checkAppreveOpb(){
            let that = this
            if(this.isApprevedOpb){
                this.$emit('showPurchase','redeem')
            }else{
                this.$emit('changeApprovedopb',true)
                Approved(Bond.abi,Bond.address,Treasury.address).then(res=>{
                    if(res.status){
                        that.isApprevedOpb = true
                        that.$emit('changeApprovedopb',false)
                        that.getAllowance()
                    }
                })
            }
        },
        getOpcPrice(){
            let that = this
            const contract = new web3.eth.Contract(Treasury.abi, Treasury.address)
            contract.methods.getBondOraclePrice().call().then((result)=>{
                let price = new BigNumber(result)
                price = price.div(Math.pow(10,that.opcDecimals))
                that.opcPrice=price.toFixed()
                that.opbPrice=that.opcPrice*that.opcPrice
            })
        },
        getOpbBalance(){
            let that = this
            const contract = new web3.eth.Contract(Bond.abi, Bond.address)
            contract.methods.balanceOf(getStore('defaultAccout')).call().then((result)=>{
                let balance = new BigNumber(result)
                balance = balance.div(Math.pow(10,that.opbDecimals))
                that.opbBalance=balance.toFixed(2)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.bondContainer{
    .fl{float:left;}
    .fr{float:right;}
    max-width:1200px;
    margin:40px auto;
    text-align:center;
    .bondPanel{
        width: 320px;
        height: 400px;
        background: #171925;
        padding:0 23px;
        border-radius:16px;
        box-sizing: border-box;
        box-shadow: 16px 16px 28px 0px rgba(21, 22, 25, 0.95), -16px -16px 24px 0px #272B3B;
        h2{
            font-size:18px;
            color:#18C671;
            line-height:100%;
            padding:32px 0 34px;
            text-align:center;
        }
        .changebar{
            height: 120px;
            background: #1C1E2C;
            border-radius: 12px;
            .coin{
                &.fl{padding-left:28px;}
                &.fr{padding-right:28px;}
                img{width:72px;height:72px;}
                p{font-size:16px;color:#fff;line-height:19px;}
            }
            .changeico{
                display:block;
                width:24px;
                height:24px;
                margin:0 auto;
                padding-top:60px;
                background: url(../assets/images/arrow.png) no-repeat center;
                background-size:24px 24px;
            }
        }
        .price{
            font-size:16.56px;
            color:#fff;
            line-height: 100%;
            padding-bottom:18px;
            padding-top:52px;
        }

    }
    .changeInfo{
        display:inline-block;
        width:280px;
        padding-top:40px;
        .infoItem{
            width: 280px;
            height: 136px;
            background: #171925;
            box-shadow: 8px 8px 20px 0px rgba(21, 22, 25, 0.95), -8px -8px 16px 0px #272B3B;
            border-radius: 12px;
            margin-bottom:48px;
            .exchangeprice{
                padding-bottom:16px;
                text-align:center;
                font-size:18px;
                color:#fff;
                line-height:32px;
                padding-top:34px;
                i{
                    display:inline-block;
                    vertical-align: middle;
                    width:32px;
                    height:32px;
                    background: url(../assets/images/dollar.png) no-repeat center;
                    margin-right:8px;
                }
            }
            .priceAlgo{
                font-size:16px;
                color:#6F727B;
                text-align:center;
            }
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
    &.is-disabled{
        border: 1px solid #343747 !important;
        color:#343747 !important;
    }
    &.disabled{
        border: 1px solid #343747;
        color:#343747;
    }
}
@media screen and (max-width: 750px) {
    .bondContainer{
        .bondPanel{
            width:320px;
            height:400px;
            float:initial;
            margin:0 auto 48px;
        }
        .changeInfo{
            padding-top:0;
        }
    }
}
</style>