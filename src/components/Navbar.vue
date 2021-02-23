<template>
    <div class="navContainer clearfix">
        <a class="logobar"><img src="@/assets/images/icon_logo.png">OPEN CASH</a>
        <div class="walletBar">
            <div class="nav_merge" @click="drawer=true">
                <img src="../assets/images/nav_merge.png">
            </div>
            <div class="unlock" @click="getWallet" v-show="!walleted">
                <i></i>
                Unlock Wallet
            </div>
            <div class="unlock" v-show="walleted" @click="walletPop=true">My Wallet</div>
            <div class="unlock" v-show="walleted">Transactions</div>
        </div>
        <ul class="navLink">
            <li :class="active_name=='home'?'active':''" @click="toPath('home')">Home</li>
            <li :class="active_name=='farm' || active_name=='farmSelect'?'active':''" @click="toPath('farm')">Bank</li>
            <li :class="active_name=='bonds'?'active':''" @click="toPath('bonds')">Bonds</li>
            <li :class="active_name=='boardRoom'?'active':''" @click="toPath('boardroom')">Boardroom</li>
        </ul>
        <el-drawer title="" :visible.sync="drawer" :show-close="false" custom-class="drawer_body" :with-header="false" @click="tolerPop=false">
          <div class="drawer_logo clearfix">
            <div class="lt_logo"> <img src="@/assets/images/icon_logo.png" alt="" />
            </div>
            <div class="rg_colse"> <img src="@/assets/images/icon_close.png" alt="" @click.stop="drawer = false"> </div>
          </div>
          <ul class="drawer_nav">
            <li :class="active_name=='home'?'active':''" @click="toPath('home')">Home</li>
            <li :class="active_name=='farm' || active_name=='farmSelect'?'active':''" @click="toPath('farm')">Bank</li>
            <li :class="active_name=='bonds'?'active':''" @click="toPath('bonds')">Bonds</li>
            <li :class="active_name=='boardRoom'?'active':''" @click="toPath('boardroom')">Boardroom</li>
          </ul>
          <ul class="drawer_nav">
            <li>Buy OPC</li>
            <li>Buy OPS</li>
            <li>Medium</li>
            <li>Telegram</li>
            <li>Twitter</li>
            <li>GitHub</li>
          </ul>
        </el-drawer>
        <MyWallet @closeMyWallet='closeWallet' v-show="walletPop"></MyWallet>
        <!-- <Transiction v-show="myTransation"></Transiction> -->
    </div>
</template>
<script>
import Web3 from 'web3'
import {setStore} from '@/config/utils'
import MyWallet from '@/components/MyWallet'
import Transiction from '@/components/Transiction'
export default {
    components:{
        MyWallet,
        Transiction
    },
    data() {
        return {
            walleted:sessionStorage.getItem('walleted'),
            active_name:this.$route.name,
            walletPop:false,
            myTransation:false,
            drawer: false,
            rpcURL:'https://kovan.infura.io/v3/58c5c1771340434488786a1d5e8ac86f'
        }  
    },
    created(){
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            web3 = new Web3(this.rpcURL)
        }
    },
    methods:{
        closeWallet(){
            this.walletPop = false
        },
        async getWallet(){
            if (window.ethereum) {
                try {
                    // 请求用户授权
                    const accounts = await ethereum.enable()
                    if(accounts && accounts.length>0){
                        this.walleted = true
                        sessionStorage.setItem('walleted',true)
                        this.getDefaultAccout()
                    }
                } catch (error) {
                    // 用户拒绝使用账户
                    this.walleted = false
                    sessionStorage.setItem('walleted',false)
                }
            }else if (window.web3) {
                window.web3 = new Web3(this.rpcURL)
                this.walleted = true
                sessionStorage.setItem('walleted',true)
                this.getDefaultAccout()
            }
            // 没有安装以太坊钱包插件(MetaMask)...
            else {
                console.log('需要安装以太坊钱包插件(例如MetaMask)才能使用!')
            }
        },
        getDefaultAccout(){
            let that = this
            web3.eth.getAccounts().then(res=>{
                let defaultAccount = res[0]
                debugger
                setStore('defaultAccout',defaultAccount)
            });
        },
        toPath(path){
            this.active_name = path
            this.$router.push('/'+path)
        }
    },    
}
</script>
<style lang="less" scoped>
.navContainer{
    padding:12px 40px;
    .logobar{
        float:left;
        font-size:20px;
        color:#fff;
        line-height:48px;
        font-weight:500;
        img{
            vertical-align: middle;
        }
    }
    .walletBar{
        float:right;
        .nav_merge{display:none;}
        .unlock{
            padding:0 12.5px;
            height: 40px;
            background: #171925;
            box-shadow: 4px 4px 8px 0px rgba(16, 17, 19, 0.95), -4px -4px 8px 0px #272B3B;
            border-radius: 10px;
            font-size:16px;
            color:#18C671;
            line-height:40px;
            text-align:center;
            float:right;
            margin-left:32px;
            cursor: pointer;
            &:last-child{
                margin-left:0;
            }
            i{
                display:inline-block;
                vertical-align: middle;
                width:20px;
                height:20px;
                margin-right:4px;
                margin-top:-3px;
                background: url(../assets/images/lock.png) no-repeat center;
                background-size:100% 100%;
            }
        }
    }
    .navLink{
        overflow:hidden;
        text-align:center;
        li{
            display:inline-block;
            vertical-align: middle;
            font-size:16px;
            color:#A9ADBA;
            line-height:48px;
            padding:0 25px;
            cursor: pointer;
            &.active{
                color:#E21C79;
            }
        }
    }
}
@media screen and (max-width: 750px) {
    .navContainer{
        padding:10px 15px;
        .navLink{
            display:none;
        }
        .logobar{
            font-size:14px;
            line-height:28px;
            img{
                width:28px;
            }
        }
        .walletBar{
            .unlock{
                height:32px;
                line-height:32px;
                font-size:13px;
                margin-left:12px;
                i{
                    width:16px;
                    height:16px;
                }
            }
            .nav_merge{
                display:block;
                float:right;
                width:24px;
                height:24px;
                padding-top: 4px;
                padding-left: 16px;
                img{
                    width:100%;
                }
            }
        } 
        .drawer_logo{
            padding:15.5px 12px 0;
            .lt_logo{
                float:left;
                font-size:18px;
                color:#fff;
                img{
                    width:36px;
                }
            }
            .rg_colse{
                float:right;
                img{
                    width:22px;
                }
            }
        }
        .drawer_nav{
            position:relative;
            padding-bottom:25px;
            padding-top:20px;
            &:nth-of-type(1){
                &:after{
                    content:'';
                    position:absolute;
                    bottom:0;
                    left:28px;
                    right:28px;
                    height:1px;
                    background:#2E303E;
                }
            }
            li{
                width:100%;
                height:52px;
                font-size:16px;
                color:#fff;
                line-height:52px;
                text-indent: 28px;
                &.active{
                    background:#52193D;
                    color:#E21C79;
                }
            }
        }
    }
    
}

</style>
<style>
.drawer_body{width:65% !important;}
.el-drawer__body{background:#171925;}
</style>