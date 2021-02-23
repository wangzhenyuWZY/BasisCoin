<template>
    <div class="transaContain">
        <div class="errorPanel" v-show="false">
            <i class="errIco"></i>
            <div class="erroInfo">
                <h2>Unable to redeem</h2>
                <p>DAIONSLPTTokenSharePool</p>
                <a>Copy error details</a>
            </div>
            <i class="closeIco"></i>
        </div>  
        <div class="succPanel">
            <i class="sucIco"></i>
            <div class="sucInfo">
                <h2>Approve OPC</h2>  
                <a>View on Etherscan</a>  
            </div>   
             <i class="closeIco"></i>
        </div>  
    </div>    
</template>
<style lang="less" scoped>
.transaContain{
    position:absolute;
    top:90px;
    right:32px;
    .succPanel{
        width: 330px;
        height: 75px;
        background: rgba(24, 198, 113, 0.29);
        border-radius: 12px;
        padding-top:18px;
        padding-left:21px;
        box-sizing: border-box;
        .sucIco{
            float:left;
            width:32px;
            height:32px;
            margin-right:9px;
            background: url(../assets/images/icon_suc.png) no-repeat center;
            background-size:100% 100%;
        }
        .sucInfo{
            float:left;
            text-align:left;
            h2{
                font-size:16px;
                color:#18C671;
                line-height:19px;
                padding-bottom:8px;
            }
            a{
                font-size:14px;
                color:#fff;
                line-height:16px;
                text-decoration: underline;
                cursor: pointer;
            }
        }
        .closeIco{
            position:absolute;
            right:12px;
            top:17px;
            width:16px;
            height:16px;
            background:url(../assets/images/closeIco.png) no-repeat center;
            background-size:100% 100%;
            cursor: pointer;
        }
    }
    .errorPanel{
        width: 330px;
        height: 102px;
        background: rgba(226, 28, 121, 0.29);
        border-radius: 12px;
        padding:17px 12px 0 19px;
        box-sizing: border-box;
        .errIco{
            float:left;
            width:31px;
            height:31px;
            background: url(../assets/images/waning.png) no-repeat center;
            background-size:100% 100%;
            margin-right:15px;
        }
        .erroInfo{
            float:left;
            text-align:left;
            h2{
                font-size:16px;
                color:#E21C79;
                line-height:19px;
                padding-bottom:4px;
            }
            p{
                font-size:14px;
                color:rgba(255,255,255,0.5);
                line-height:16px;
                padding-bottom:14px;
            }
            a{
                font-size:14px;
                color:#E21C79;
                line-height:18px;
                text-decoration: underline;
            }
        }
        .closeIco{
            position:absolute;
            right:12px;
            top:17px;
            width:16px;
            height:16px;
            background:url(../assets/images/closeIco.png) no-repeat center;
            background-size:100% 100%;
            cursor: pointer;
        }
    }
}
@media screen and (max-width: 750px) {
    .transaContain{
        top:65px;
        right:15px;
        .errorPanel{
            background:#52193D;
        }
        .succPanel{
            background:#174B3B;
        }
    }
}
</style>