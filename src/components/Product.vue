<template>
    <div class="productBar">
        <div class="productItem">
            <h2>Open Cash</h2>
            <div class="productInfo">
                <img class="productLogo" src="@/assets/images/OPC.png">
                <p class="price">${{opcPrice?opcPrice:'--'}}</p>
                <p class="tip">Current Price</p>
                <p class="price padtop">{{OPC.total?OPC.total:'--'}}</p>
                <p class="tip">Circulating Supply</p>
            </div>
        </div>
        <div class="productItem">
            <h2>Open Share</h2>
            <div class="productInfo">
                <img class="productLogo" src="@/assets/images/icon_OPB.png">
                <p class="price">${{opsPrice?opsPrice:'--'}}</p>
                <p class="tip">Current Price</p>
                <p class="price padtop">{{OPS.total?OPS.total:'--'}}</p>
                <p class="tip">Total Supply</p>
            </div>
        </div>
        <div class="productItem">
            <h2>Open Bond</h2>
            <div class="productInfo">
                <img class="productLogo" src="@/assets/images/icon_OPS.png">
                <p class="price">${{opbPrice?opbPrice:'--'}}</p>
                <p class="tip">Current Price</p>
                <p class="price padtop">{{OPB.total?OPB.total:'--'}}</p>
                <p class="tip">Total Supply</p>
            </div>
        </div>
    </div>
</template>
<script>
import {Treasury,Cash,Bond,Share,DAIOPCPool,DAIOPSPool,PAIRLP,DAITOKEN} from '../api/deployments/deployments.mainnet';
import {Decimals,GetTokenPriceFromUniswap} from '../utils'
import BigNumber from 'bignumber.js'
export default {
    data() {
        return {
            OPC:{
                price:0,
                total:0
            },
            OPS:{
                price:0,
                total:0
            },
            OPB:{
                price:0,
                total:0
            },
            lptAddress:'',
            poolLiquidity:{},
            opcDecimals:18,
            opbDecimals:18,
            opsDecimals:18,
            daiDecimals:6,
            opcPrice:0,
            opbPrice:0,
            opsPrice:0
        }  
    },
    created(){
        this.getLpAddress()
        this.getHomeInfo()
        this.getOpcPrice()
    },
    methods:{
        getHomeInfo(){
            let that = this
            Decimals(Cash.abi, Cash.address).then(res=>{
                that.opcDecimals = res
                const contract = new web3.eth.Contract(Cash.abi, Cash.address)
                contract.methods.totalSupply().call().then((result)=>{
                    let total = new BigNumber(result)
                    total = total.div(Math.pow(10,res))
                    that.OPC.total = total.toFixed(0)
                })
            })
            Decimals(Bond.abi, Bond.address).then(res=>{
                that.opbDecimals = res
                const contract = new web3.eth.Contract(Bond.abi, Bond.address)
                contract.methods.totalSupply().call().then((result)=>{
                    let total = new BigNumber(result)
                    total = total.div(Math.pow(10,res))
                    that.OPB.total = total.toFixed(0)
                })
            })
            Decimals(Share.abi, Share.address).then(res=>{
                that.opsDecimals = res
                const contract = new web3.eth.Contract(Share.abi, Share.address)
                contract.methods.totalSupply().call().then((result)=>{
                    let total = new BigNumber(result)
                    total = total.div(Math.pow(10,res))
                    that.OPS.total = total.toFixed(0)
                })
            })
            Decimals(DAITOKEN.abi, DAITOKEN.address).then(res=>{
                that.daiDecimals = res
            })
        },
        getLpAddress(){
            let that = this
            const contract = new web3.eth.Contract(DAIOPSPool.abi, DAIOPSPool.address)
            contract.methods.lpt().call().then((res)=>{
                that.lptAddress = res
                that.getOpsPrice()
            })
        },
        getOpcPrice(){
            let that = this
            const contract = new web3.eth.Contract(Treasury.abi, Treasury.address)
            contract.methods.getSeigniorageOraclePrice().call().then((result)=>{
                let price = new BigNumber(result)
                price = price.div(Math.pow(10,that.opcDecimals))
                that.opcPrice=price.toFixed(2)
                that.opbPrice = (price*price).toFixed(2)
            })
        },
        getOpsPrice(){
            let that = this
            const contract = new web3.eth.Contract(PAIRLP.abi, this.lptAddress)
            contract.methods.getReserves().call().then((res)=>{
                that.poolLiquidity = res
                let ops = {
                    name:'OPS',
                    decimals:that.opsDecimals,
                    address:Cash.address
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
.productBar{
  .productItem{
      display:inline-block;
      vertical-align: top;
      margin-left:80px;
      &:first-child{
          margin-left:0;
      }
      h2{
          font-size:24px;
          color:#fff;
          line-height:100%;
          padding-bottom:44px;
          text-align:center;
      }
      .productInfo{
          width: 280px;
          height: 336px;
          background: #171925;
          box-shadow: 16px 16px 28px 0px rgba(21, 22, 25, 0.95), -16px -16px 24px 0px #272B3B;
          border-radius: 20px;
          .productLogo{
              width: 72px;
              height: 72px;
              padding-top:32px;
              padding-bottom:16px;
          }
          .price{
              font-size:32px;
              color:#fff;
              line-height:38px;
              padding-bottom:8px;
              &.padtop{
                  padding-top:30px;
              }
          }
          .tip{
              font-size:16px;
              color:#fff;
              line-height:100%;
          }
      }
  }
}

@media screen and (max-width: 750px) {
    .productBar{
        .productItem{
            margin-left:0;
            margin-bottom:36px;
            h2{
                font-size:20px;
                padding-bottom:28px;
            }
            .productInfo{
                width:320px;
                height:354px;
                .productLogo{
                    width:80px;
                    padding-top:36px;
                    height:80px;
                }
            }
        }
    } 
}
</style>