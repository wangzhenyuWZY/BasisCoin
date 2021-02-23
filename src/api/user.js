import api from './index'
// axios
import request from '@/utils/request'

// 登录
export function login(data) {
  return request(
    api.Login,
    'post',
    data
  )
}
