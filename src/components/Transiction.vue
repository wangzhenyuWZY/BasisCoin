<template>
    <div class="transictionWrap">
        <div class="transicInner">
            <h2 class="title">Transactions</h2>
            <div class="noTransiction" v-show="false">
                <img src="../assets/images/noIco.png">
                <p>No transactions</p>
            </div>
            <div class="hasTransiction">
                <div class="hasTransPanel">
                    <div class="transItem clearfix">
                        <span class="result">Recent Transactions</span>
                        <div class="resultCon">
                            <i class="toOther"></i>
                            <span class="transtext">Approve OPC</span>
                            <i class="resultIco"></i>
                        </div>
                    </div>
                    <div class="transItem clearfix">
                        <span class="result">Recent Transactions</span>
                        <div class="resultCon">
                            <i class="toOther"></i>
                            <span class="transtext">Approve OPC</span>
                            <i class="resultIco"></i>
                        </div>
                    </div>
                    <div class="transItem clearfix">
                        <span class="result">Recent Transactions</span>
                        <div class="resultCon">
                            <i class="toOther"></i>
                            <span class="transtext">Approve OPC</span>
                            <i class="resultIco"></i>
                        </div>
                    </div>
                    <div class="transItem clearfix">
                        <span class="result">Recent Transactions</span>
                        <div class="resultCon">
                            <i class="toOther"></i>
                            <span class="transtext">Approve OPC</span>
                            <i class="resultIco"></i>
                        </div>
                    </div>
                    <div class="transItem clearfix">
                        <span class="result">Recent Transactions</span>
                        <div class="resultCon">
                            <i class="toOther"></i>
                            <span class="transtext">Approve OPC</span>
                            <i class="resultIco"></i>
                        </div>
                    </div>
                </div>
                <div class="clearfix"><span class="delete">Delete</span></div>
                <button class="closeBtn">Close</button>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.transictionWrap{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    z-index:9;
    background:rgba(0,0,0,0.7);
    .transicInner{
        position:absolute;
        top:25%;
        left:50%;
        margin-left:-220px;
        width: 440px;
        min-height: 318px;
        background: #171925;
        border-radius: 15px;
        border: 1px solid #E21C79;
        .title{
            font-size:18px;
            color:#18C671;
            line-height:100%;
            padding-top:22px;
            padding-bottom:24px;
            text-align:center;
        }
        .noTransiction{
            text-align:center;
            img{
                width:128px;
            }
            p{
                font-size:14px;
                color:#6F727B;
            }
        }
        .hasTransiction{
            .hasTransPanel{
                width: 376px;
                min-height: 156px;
                background: #1C1E2C;
                border-radius: 12px;
                box-sizing: border-box;
                padding:25px 16px 0;
                margin:0 auto;
            }
            .delete{
                float:right;
                clear:both;
                margin-right:48px;
                width: 56px;
                height: 20px;
                border-radius: 4px;
                border: 1px solid #E21C79;
                line-height:20px;
                text-align: center;
                font-size:14px;
                margin-top:16px;
                color:#E21C79;
                cursor: pointer;
            }
            .closeBtn{
                width: 274px;
                height: 56px;
                background: #171925;
                box-shadow: 4px 4px 8px 0px rgba(16, 17, 19, 0.95), -4px -4px 8px 0px #272B3B;
                border-radius: 12px;
                margin:36px auto 32px;
                font-size:16px;
                color:#18C671;
                line-height:56px;
                text-align:center;
                cursor: pointer;
                clear: both;
                display: block;
            }
            .transItem{
                padding-bottom:25px;
                .result{
                    float:left;
                    font-size:16px;
                    color:#fff;
                    line-height:19px;
                }
                .resultCon{
                    float:right;
                }
                .toOther{
                    float:right;
                    width:16px;
                    height:16px;
                    background: url(../assets/images/icon_jump_green.png) no-repeat center;
                    background-size:100% 100%;
                    margin-top:2px;
                }
                .transtext{
                    float:right;
                    font-size:14px;
                    color:#6F727B;
                    line-height:19px;
                    padding:0 2px 0 4px;
                }
                .resultIco{
                    float:right;
                    width:16px;
                    height:16px;
                    background: url(../assets/images/icon_suc.png) no-repeat center;
                    background-size: 100% 100%;
                    margin-top:2px;
                }
            }
        }
    }
}
@media screen and (max-width: 750px) {
    .transictionWrap{
        .transicInner{
            width:320px;
            min-height:323px;
            margin-left:-160px;
            top:15%;
        }
        .transicInner{
            .hasTransiction{
                .hasTransPanel{
                    width:280px;
                    text-align:left;
                    .transItem {
                        padding-bottom:16px;
                    }
                    .result{
                        float:initial;
                    }
                    .resultCon{
                        overflow:hidden;
                        float:initial;
                        padding-top:6px;
                        .resultIco{
                            float:left;
                        }
                        .transtext{
                            float: inherit;
                        }
                    }
                }
            }
        } 
        
    }
}
</style>