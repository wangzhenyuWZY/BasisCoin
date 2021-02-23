<template>
    <div class="myWallet">
        <div class="walletInner">
            <p class="walletTitle">My Wallet</p>
            <i class="closeico" @click="closeMyWallet"></i>
            <div class="walletPanel">
                <div class="walletItem">
                    <img src="../assets/images/icon_OneCashEarned.png">
                    <h2>{{opcBalance}}</h2>
                    <p>OPC Available</p>
                </div>
                <div class="walletItem">
                    <img src="../assets/images/icon_OPS.png">
                    <h2>{{opbBalance}}</h2>
                    <p>OPB Available</p>
                </div>
                <div class="walletItem">
                    <img src="../assets/images/icon_OPB.png">
                    <h2>{{opsBalance}}</h2>
                    <p>OPS Available</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {Bond,Cash,Share} from '../api/deployments/deployments.mainnet';
import {Decimals} from '../utils'
import BigNumber from 'bignumber.js'
import {getStore} from '@/config/utils'
export default {
    data(){
        return {
            opbBalance:0,
            opcBalance:0,
            opsBalance:0
        }
    },
    mounted(){
        this.getMyBalance()
    },
    methods:{
        closeMyWallet(){
            this.$emit('closeMyWallet')
        },
        getMyBalance(){
            let that = this
            Decimals(Bond.abi,Bond.address).then(res=>{
                const contract = new web3.eth.Contract(Bond.abi, Bond.address)
                contract.methods.balanceOf(getStore('defaultAccout')).call().then((result)=>{
                    let balance = new BigNumber(result)
                    balance = balance.div(Math.pow(10,res))
                    that.opbBalance=balance.toFixed(2)
                })
            })
            Decimals(Cash.abi,Cash.address).then(res=>{
                const contract = new web3.eth.Contract(Cash.abi, Cash.address)
                contract.methods.balanceOf(getStore('defaultAccout')).call().then((result)=>{
                    let balance = new BigNumber(result)
                    balance = balance.div(Math.pow(10,res))
                    that.opcBalance=balance.toFixed(2)
                })
            })
            Decimals(Share.abi,Share.address).then(res=>{
                const contract = new web3.eth.Contract(Share.abi, Share.address)
                contract.methods.balanceOf(getStore('defaultAccout')).call().then((result)=>{
                    let balance = new BigNumber(result)
                    balance = balance.div(Math.pow(10,res))
                    that.opsBalance=balance.toFixed(2)
                })
            })
        },
    }
}
</script>
<style lang="less" scoped>
.myWallet{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    z-index: 9;
    background:rgba(0,0,0,0.7);
    .walletInner{
        position:absolute;
        top:35%;
        left:50%;
        margin-left:-280px;
        width: 610px;
        height: 240px;
        background: #171925;
        border-radius: 15px;
        border: 1px solid #E21C79;
        .walletPanel{text-align:center;}
        .walletTitle{
            font-size:18px;
            color:#18C671;
            line-height:100%;
            padding-top:22px;
            padding-bottom:24px;
            text-align:center;
        }
        .closeico{
            position:absolute;
            right:10px;
            top:10px;
            width:16px;
            height:16px;
            background:url(../assets/images/closeIco.png) no-repeat center;
            background-size:100% 100%;
            cursor: pointer;
        }
    }
    .walletPanel{
        .walletItem{
            display: inline-block;
            vertical-align: middle;
            margin:0 35px;
            text-align:center;
            img{
                width:64px;
                height:64px;
            }
            h2{
                font-size:32px;
                color:#fff;
                line-height:38px;
                padding-top:4px;
            }
            p{
                font-size:16.56px;
                color:#6F727B;
                line-height:100%;
                padding-top:4px;
            }
        }
    }
}
@media screen and (max-width: 750px) {
    .myWallet{
        .walletInner{
            width:320px;
            height:451px;
            margin-left:-160px;
            top:15%;
            .walletTitle{
                padding-top:16px;

            }
            .walletItem{
                margin-bottom:24px;
                img{
                    width:56px;
                    height:56px;
                }
                h2{
                    font-size:24px;
                    padding-top:0;
                    line-height:26px;
                }
                p{
                    font-size:15px;
                }
            }
        }
    }
}
</style>