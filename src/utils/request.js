import axios from 'axios'
import store from '@/store'
import {getStore} from '@/config/utils'
import { Toast } from 'vant'
const qs = require('qs')
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
// create an axios instance
// const service = axios.create({
//   baseURL: baseApi, // url = base api url + request url
//   withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000, // request timeout
//   headers: {
//       'Content-Type': "application/x-www-form-urlencoded"
//   }
// })\

const service = (url,method,data) =>{
  const jsonUrl = (json) => {
    let arr = []
    let str = ''
    for (let i in json) {
      str = i + '=' + json[i]
      arr.push(str)
    }
    return arr.join('&')
  }
  let realUrl = baseApi+url
  let type = method.toLowerCase()
  let res = {}
  let headers = {
    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
    'lang':'zh_CN',
    'token':'c1b71a7db89d4445bd637e6b7d22ac19'
  }
  if(type === 'get'){
    console.log(realUrl)
    res = axios.get(realUrl + '?' + jsonUrl(data),{headers:headers})
    .catch(function (error) {
      alert(error)
    });
  } else if(type === 'post'){
    res = axios.post(realUrl,qs.stringify(data),{headers:headers})
    .catch(function (error) {
      alert(error)
    })
  } else if(type === 'put') {
    res = axios.put(realUrl,qs.stringify(data))
    .catch(function (error) {
     
    })
  }
  return res
}

// request拦截器 request interceptor
// service.interceptors.request.use(
//   config => {
//     // 不传递默认开启loading
//     if (!config.hideloading) {
//       // loading
//       Toast.loading({
//         forbidClick: true
//       })
//     }
//     config.headers['Content-Type'] = 'application/x-www-form-urlencoded' 
//     if (store.getters.token) {
//       config.headers['X-Token'] = ''
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )
// // respone拦截器
// service.interceptors.response.use(
//   response => {
//     Toast.clear()
//     const res = response.data
//     if (res.status && res.status !== 200) {
//       // 登录超时,重新登录
//       if (res.status === 401) {
//         store.dispatch('FedLogOut').then(() => {
//           location.reload()
//         })
//       }
//       return Promise.reject(res || 'error')
//     } else {
//       return Promise.resolve(res)
//     }
//   },
//   error => {
//     Toast.clear()
//     console.log('err' + error) // for debug
//     return Promise.reject(error)
//   }
// )

export default service
