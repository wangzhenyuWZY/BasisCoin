/**
 * Created by Wangye on 21/01/07.
 */
import {getStore} from '@/config/utils'
import { ChainId, Token, Route, Pair, TokenAmount  } from '@uniswap/sdk'
/**
 * 查询授权
 * @param {合约} Contract 
 * @param {abi} ABI
 */
const Allowance = (Contract,Spender) => {
  return new Promise(function(resolve, reject) {
      const contract = new web3.eth.Contract(Contract.abi, Contract.address)
      let defaultAccout = getStore('defaultAccout')
      contract.methods.allowance(defaultAccout,Spender).call().then((res)=>{
          resolve(res)
      })
  })
}
/**
 * 授权
 * @param {合约ABI} ABI 
 * @param {合约地址} ADDRESS 
 * @param {合约地址}
 */
const Approved = (ABI,ADDRESS,Spender) => {
  return new Promise(function(resolve, reject) {
    const contract = new web3.eth.Contract(ABI, ADDRESS)
    console.log(getStore('defaultAccout'))
    contract.methods.approve(Spender,'100000000000000000000000000').send({from: getStore('defaultAccout')}).then((result)=>{
      resolve(result)
    })
  })
}
/**
 * 查询精度
 * @param {合约地址} address 
 * @param {abi} ABI
 */
const Decimals = (ABI,ADDRESS) => {
  return new Promise(function(resolve, reject) {
      const contract = new web3.eth.Contract(ABI, ADDRESS)
      contract.methods.decimals().call().then((res)=>{
          console.log(res)
          resolve(res)
      })
  })
}
/**
 * 轮询获取交易信息
 * @param {交易哈希} id 
 */
const getConfirmedTransaction = (id) => { 
  return new Promise(function(resolve, reject) {
    try {
      var interval = window.setInterval(() => {
        window.tronWeb.trx.getTransactionInfo(id).then((res) => {
          if (res.contractResult) {
            clearInterval(interval)
            console.log(res)
            resolve(res)
          }
        })
      }, 2000)
    } catch (error) {
      console.log(error)
    }
  })
}
/**
 * 价格计算
 */
const GetTokenPriceFromUniswap = (token1,token2,poolLiquidity) => {
  const OPC = new Token(ChainId.MAINNET, token1.address, token1.decimals, token1.name, 'Caffeine')
  const DAI = new Token(ChainId.MAINNET, token2.address, token2.decimals, token2.name, 'Caffeine')
  const OPC_DAI = new Pair(new TokenAmount(OPC, poolLiquidity._reserve1), new TokenAmount(DAI, poolLiquidity._reserve0))
  const route = new Route([OPC_DAI], OPC)
  return route.midPrice.toSignificant(3)
} 


export {
  Allowance,
  Approved,
  Decimals,
  getConfirmedTransaction,
  GetTokenPriceFromUniswap
}


