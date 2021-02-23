<template>
    <div class="purchaseWrap">
        <div class="purchaseInner clearfix">
            <h2 class="title">{{title}}</h2>
            <p class="balance"><span>{{lpBalance}}</span> {{pair.name}} Available</p>
            <div class="purPut">
                <span class="max" @click="depositNum=lpBalance">MAX</span>
                <span class="opc">{{pair.name}}</span>
                <input v-model="depositNum">
            </div>
            <p class="baifenbi" v-show="false"><span>0%</span> return when OPC>$1</p>
            <div class="btnbox">
                <button class="cancel" @click="cancel">Cancel</button>
                <button class="purchase" @click="confirm">{{title}}</button>
            </div>
        </div>
    </div>
</template>
<script>
import {PAIRLP,Cash,Bond,Share,Boardroom,DAIOPCPool,DAIOPSPool} from '../api/deployments/deployments.mainnet';
import {Decimals} from '../utils'
import {getStore} from '@/config/utils'
import BigNumber from 'bignumber.js'
export default {
    data() {
        return {
            lpBalance:0,
            depositNum:0,
            lpDecimals:0
        }  
    },
    props:{
        pair: {
            type: Object,
            default: {}
        },
        lptAddress:{
            type:String,
            default:''
        },
        title:{
            type:String,
            default:''
        }
    },
    watch: {
        title(val){
            this.getBalance()
        },
        lptAddress(val) {
            this.getBalance()
        }
    },
    created(){
        if(this.lptAddress){
            this.getBalance()
        }
    },
    methods:{
        getBalance(){
            let that = this
            let abi = []
            let pool = {}
            if(this.pair.name=='OPS'){
                abi = Share.abi
                pool = Share
            }else if(this.pair.name=='OPC'){
                abi = Cash.abi
                pool = Cash
            }else if(this.pair.name=='OPC-DAI-LP' && this.title=='Settle'){
                abi = Cash.abi
                pool = DAIOPCPool
            }else if(this.pair.name=='OPS-DAI-LP' && this.title=='Settle'){
                abi = Cash.abi
                pool = DAIOPSPool
            }else{
                abi = PAIRLP.abi
                pool = {
                    abi:PAIRLP.abi,
                    address:that.lptAddress
                }
            }
            Decimals(abi,this.lptAddress).then(res=>{
                that.lpDecimals = res
                const contract = new web3.eth.Contract(pool.abi,pool.address)
                contract.methods.balanceOf(getStore('defaultAccout')).call().then((result)=>{
                    let total = new BigNumber(result)
                    total = total.div(Math.pow(10,res))
                    that.lpBalance = total.toFixed()
                })
            })
        },
       cancel(){
           this.$emit('cancelPop')
       },
       confirm(){
           let num = new BigNumber(this.depositNum)
           num = num.times(Math.pow(10,this.lpDecimals))
           this.$emit('confirmPop',num.toFixed())
           this.depositNum = 0
       }
    }
}
</script>
<style lang="less" scoped>
.purchaseWrap{
    position:fixed;
    top:0;
    right:0;
    bottom:0;
    left:0;
    background:rgba(0,0,0,0.7);
    .purchaseInner{
        position:absolute;
        top:35%;
        left:50%;
        margin-left:-280px;
        width: 560px;
        height: 320px;
        background: #171925;
        border-radius: 12px;
        border: 1px solid #E21C79;
        padding:0 40px;
        box-sizing: border-box;
        .title{
            font-size:18px;
            color:#18C671;
            line-height:21px;
            padding-top:16px;
            padding-bottom:42px;
            text-align:center;
        }
        .balance{
            float:right;
            font-size:14px;
            color:#fff;
            line-height:16px;
            padding-bottom:9px;
            span{
                color:#E21C79;
                line-height:16px;
            }
        }
        .purPut{           
            height: 56px;
            background: #1C1F2C;
            border-radius: 12px;
            padding:14px;
            box-sizing: border-box;
            clear:both;
            .max{
                float:right;
                width: 56px;
                height: 28px;
                background: #E21C79;
                border-radius: 24px;
                font-size:14px;
                color:#fff;
                line-height:28px;
                margin-left:5px;
                text-align:center;
                cursor: pointer;
            }
            .opc{
                float:right;
                font-size:16px;
                color:#fff;
                line-height:28px;
            }
            input{
                overflow:hidden;
                background:none;
                line-height:28px;
                font-size:24px;
                color:#E21C79;
                float:left;
            }
        }
        .baifenbi{
            text-align:left;
            padding-left:14px;
            padding-top:8px;
            font-size:14px;
            color:#fff;
            line-height:16px;
            span{
                color:#E21C79;
                line-height:16px;
            }
        }
        .btnbox{
            text-align:center;
            padding-top:40px;
            button{
                display:inline-block;
                vertical-align: middle;
                width: 160px;
                height: 56px;
                background: #171925;
                box-shadow: 4px 4px 8px 0px rgba(16, 17, 19, 0.95), -4px -4px 8px 0px #272B3B;
                border-radius: 12px;
                line-height:56px;
                text-align:center;
                font-size:16px;
                margin:0 16px;
                cursor: pointer;
                &.cancel{
                    color:#fff;
                }
                &.purchase{
                    color:#18C671;
                }
            }
        }
    }
}
@media screen and (max-width: 750px) {
    .purchaseWrap{
        .purchaseInner{
            width:320px;
            margin-left:-160px;
            padding:0 20px;
            .purPut{
                padding:12px;
                input{
                    width:60%;
                }
            }
            .btnbox{
                button{
                    width:110px;
                    margin:0 12px;
                }
            }
        }
    }
}
</style>