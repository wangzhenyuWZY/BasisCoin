<template>
    <div class="boardInfo">
        <div class="boardItem">
            <p class="pricetip">Current Price</p>
            <p class="time">{{hou}}:{{min}}:{{sec}}</p>
            <div class="slidebar">
                <span :style="'width:'+fenbi+'%'"></span>
            </div>
        </div>
        <div class="boardItem item1">
            <div class="boardLogo">
                <img src="@/assets/images/icon_OPS_Price.png">
            </div>
            <p class="value">${{parseFloat(opcPrice).toFixed(2)}}</p>
            <p class="label">OPC Price(TWAP)</p>
        </div>
        <div class="boardItem item2">
            <div class="boardLogo">
                <img src="@/assets/images/icon_ScalingFactor.png">
            </div>
            <p class="value">x{{maxrate}}</p>
            <p class="label">Scaling Factor</p>
        </div>
        <div class="boardItem item3">
            <div class="boardLogo">
                <img src="@/assets/images/icon_CurrentPrice.png">
            </div>
            <p class="value">~${{opsPrice}}</p>
            <p class="label">Treasury Amount</p>
        </div>
    </div>
</template>
<script>
import {Boardroom,DAIOPSPool,Share,Cash,DAITOKEN,PAIRLP,Treasury} from '../api/deployments/deployments.mainnet';
import {Decimals,GetTokenPriceFromUniswap} from '../utils'
import BigNumber from 'bignumber.js'
export default {
    data() {
        return {
           period:0,
           startTime:0,
           hou:0,
           min:0,
           sec:0,
           opsDecimals:18,
            daiDecimals:6,
            opcPrice:0,
            opsPrice:0,
            maxrate:0,
            fenbi:0
        }  
    },
    props:[],
    created(){
        
    },
    mounted(){
        this.getHomeInfo()
        this.getLpAddress()
        this.getStartTime()
        this.getMaxrate()
        this.getOpcPrice()
    },
    methods:{
        getOpcPrice(){
            let that = this
            const contract = new web3.eth.Contract(Treasury.abi, Treasury.address)
            contract.methods.getBondOraclePrice().call().then((result)=>{
                let price = new BigNumber(result)
                price = price.div(Math.pow(10,that.opcDecimals))
                that.opcPrice=price.toFixed()
            })
        },
        async getHomeInfo(){
            let that = this
            Decimals(Cash.abi, Cash.address).then(res=>{
                that.opcDecimals = res
            })
            Decimals(Share.abi, Share.address).then(res=>{
                that.opsDecimals = res
            })
            Decimals(DAITOKEN.abi, DAITOKEN.address).then(res=>{
                that.daiDecimals = res
            })
        },
        getMaxrate(){
            let that = this
            const contract = new web3.eth.Contract(Treasury.abi, Treasury.address)
            contract.methods.maxInflationRate().call().then((result)=>{
                that.maxrate = result/100+1
            })
        },
        getPeriod(){
            let that = this
            const contract = new web3.eth.Contract(Boardroom.abi, Boardroom.address)
            contract.methods.epochPeriod().call().then((result)=>{
                that.period = result
                that.setDownTime()
            })
        },
        getStartTime(){
            let that = this
            const contract = new web3.eth.Contract(Boardroom.abi, Boardroom.address)
            contract.methods.epochAlignTimestamp().call().then((result)=>{
                that.startTime = result
                that.getPeriod()
            })
        },
        setDownTime(){
            var interval = window.setInterval(() => {
                let nowTime = parseInt(new Date().getTime()/1000)
                let nowPeriod = Math.ceil((nowTime-this.startTime)/this.period)
                let endTime = (parseInt(this.startTime)+nowPeriod*this.period)*1000
                var date=(new Date(endTime)) - (new Date());
                if (date > 0) {
                    let nowMin = endTime-nowTime*1000
                    nowMin = nowMin/1000/60
                    let period = this.period/60
                    this.fenbi = nowMin/period*100
                    let time = date / 1000;
                    // 获取时、分、秒,毫秒
                    this.hou = parseInt((time % (60 * 60 * 24)) / 3600)<10?('0'+parseInt((time % (60 * 60 * 24)) / 3600)):parseInt((time % (60 * 60 * 24)) / 3600)
                    this.min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)<10?('0'+parseInt(((time % (60 * 60 * 24)) % 3600) / 60)):parseInt(((time % (60 * 60 * 24)) % 3600) / 60);
                    this.sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)<10?('0'+parseInt(((time % (60 * 60 * 24)) % 3600) % 60)):parseInt(((time % (60 * 60 * 24)) % 3600) % 60);
                }else{
                    clearInterval(interval)
                    this.getPeriod()
                }
            },1000)
        },
        getLpAddress(){
            let that = this
            const contract = new web3.eth.Contract(DAIOPSPool.abi, DAIOPSPool.address)
            contract.methods.lpt().call().then((res)=>{
                that.lptAddress = res
                that.getBalanceInPool()
            })
        },
        getBalanceInPool(){
            let that = this
            const contract = new web3.eth.Contract(PAIRLP.abi, this.lptAddress)
            contract.methods.getReserves().call().then((res)=>{
                that.poolLiquidity = res
                let ops = {
                    name:'OPS',
                    decimals:that.opsDecimals,
                    address:Share.address
                }
                let dai = {
                    name:'DAI',
                    decimals:that.daiDecimals,
                    address:DAITOKEN.address
                }
                that.opsPrice = GetTokenPriceFromUniswap(ops,dai,res)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.boardInfo{
    text-align:center;
    padding-top:40px;
    padding-bottom:40px;
    .boardItem{
        display:inline-block;
        vertical-align: middle;
        width: 280px;
        height: 136px;
        background: #171925;
        box-shadow: 8px 8px 20px 0px rgba(21, 22, 25, 0.95), -9px -9px 16px 0px #272B3B;
        border-radius: 12px;
        text-align:center;
        margin:0 20px;
        &.item1{
            background: url(../assets/images/img_OPS_Price.png) no-repeat right bottom;
            background-size:136px 136px;
        }
        &.item2{
            background: url(../assets/images/icon_ScalingFactor_block.png) no-repeat right bottom;
            background-size:136px 136px;
        }
        &.item3{
            background: url(../assets/images/icon_CurrentPrice_block.png) no-repeat right bottom;
            background-size:136px 136px;
        }
        .pricetip{
            font-size:16px;
            color:#6F727B;
            line-height:100%;
            padding-top:24px;
            padding-bottom:8px;
        }
        .time{
          font-size:32px;
          color:#fff;  
          line-height:100%;
          padding-bottom: 18px;
        }
        .slidebar{
            position: relative;
            width: 230px;
            height: 8px;
            background: #232534;
            border-radius: 9px;
            margin-left:28px;
            span{
                position:absolute;
                top:0;
                left:0;
                bottom:0;
                width:100%;
                background:#18C671;
                border-radius: 9px;
            }
        }
        .boardLogo{
            float:left;
            width:72px;
            height:72px;
            padding-left:20px;
            padding-top:32px;
            img{width:100%;}
        }
        .value{
            overflow: hidden;
            padding-left:13px;
            font-size:32px;
            color:#fff;
            line-height:100%;
            padding-top:40px;
            padding-bottom:4px;
            text-align:left;
        }
        .label{
            overflow: hidden;
            padding-left:13px;
            font-size: 16px;
            color:#6F727B;
            text-align:left;
        }
    }
}
@media screen and (max-width: 750px) {
    .boardInfo{
        .boardItem{
            width:248px;
            height:110px;
            margin-bottom:32px;
            .pricetip{
                font-size:15px;
                padding-top:14px;
            }
            .time{
                font-size:22px;
            }
            .slidebar{
                width:160px;
                margin-left:44px;
            }
            .boardLogo{
                width:56px;
                height:56px;
                padding-left:12px;
                padding-top:22px;
            }
            .value{
                padding-left:8px;
                padding-top:26px;
                font-size:22px;
            }
            .label{
                font-size:15px;
                padding-left:8px;
            }
            &.item1,&.item2,&.item3{
                background-size:100px 100px;
            }
        }
    }
}
</style>