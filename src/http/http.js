/*
 * @Author:
 * @Date: 2022-09-11 10:38:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-24 13:44:06
 * @Description: 请填写简介
 */

import axios from "axios"
//默认提交表单
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8"
axios.defaults.headers.get["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8"
axios.defaults.headers.delete["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8"

// 响应拦截器
axios.interceptors.response.use(
  (response) => {},
  // 可根据错误响应码判断状态，做出相应的处理
  (error) => {
    if (error.response.code) {
      switch (error.response.code) {
        // 401: 未登录
        // 未登录时跳转登录界面，登录成功后回调登录前被拦截的地址 query.redirect
        case 401:
          // this.$router.push({ name: "404" })
          break
        // 403 token过期
        case 403:
          break
        // 404请求不存在
        case 404:
          break
        // 其他错误，弹出对应的响应信息
        default:
          debugger
          break
      }
      return Promise.reject(error.response)
    }
  }
)
