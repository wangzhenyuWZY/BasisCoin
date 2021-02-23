<template>
    <div class="pairContainer clearfix">
        <div class="pairItem">
            <div class="pairLogo">
                <img src="@/assets/images/pairLogo1.png">
                <img src="@/assets/images/pairLogo2.png">
            </div>
            <h2 class="pairTitle">Earned OPS by OPC-DAI-LP</h2>
            <p class="pairTip">Deposit OPC_DAI-UNI-LPV2 Earn Open Share</p>
            <button class="selectBtn" @click="toDeposit('OPC-DAI-LP')">Select</button>
        </div>
        <div class="pairItem">
            <div class="pairLogo">
                <img src="@/assets/images/pairLogo3.png">
                <img src="@/assets/images/pairLogo2.png">
            </div>
            <h2 class="pairTitle">Earned OPS by OPS-DAI-LP</h2>
            <p class="pairTip">Deposit OPS_DAI-UNI-LPV2 Earn Open Share</p>
            <button class="selectBtn" @click="toDeposit('OPS-DAI-LP')">Select</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
        }  
    },
    created(){
        
    },
    methods:{
        toDeposit(pair){
            this.$router.push({
                path:'/farmSelect',
                query:{
                    pair:pair
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.pairContainer{
    max-width:1440px;
    margin:0 auto;
    .pairItem{
        display:inline-block;
        vertical-align: middle;
        margin:0 40px;
        width: 346px;
        height: 426px;
        background: #171925;
        box-shadow: 16px 16px 28px 0px rgba(21, 22, 25, 0.95), -16px -16px 24px 0px #242736;
        border-radius: 20px;
        border: 13px solid #151619;
        background-image: url(../assets/images/img_bg.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        padding:0 20px;
        box-sizing: border-box;
        .pairLogo{
            text-align:center;
            padding-top:50px;
            padding-bottom:32px;
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
        .pairTitle{
            font-size:20px;
            color:#fff;
            line-height:24px;
            padding-bottom:12px;
        }
        .pairTip{
            font-size:16px;
            color:#A6AEB7;
            line-height:20px;
            width:203px;
            height:40px;
            text-align:center;
            padding-bottom:75px;
            margin:0 auto;
        }
        .selectBtn{
            width: 100%;
            height: 56px;
            border-radius: 12px;
            border: 1px solid #18C671;
            line-height:56px;
            text-align:center;
            font-size:16px;
            color:#18C671;
            background:none;
            cursor: pointer;
        }
    }
}
@media screen and (max-width: 750px) {
    .pairContainer{
        .pairItem{
            margin-left:0;
            display:block;
            width:320px;
            height:394px;
            margin:0 auto 48px;
            .pairTitle{
                font-size:18px;
            }
            .pairTip{
                font-size:14px;
                padding-bottom:65px;
            }
        }
    }
}
</style>