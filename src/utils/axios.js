/*
 * @Author:
 * @Date: 2022-04-09 09:58:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-09 10:07:21
 * @Description: 请填写简介
 */
// TODO 暂未完成 axios部分
import axios from "axios"
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8"
axios.defaults.headers.get["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8"
axios.defaults.headers.delete["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8"

function axio(url, method, data, params, success, fail) {
  axios({
    url,
    method,
    data,
    params,
  })
    .then((response) => {
      success(response)
    })
    .catch((err) => {
      fail(err)
    })
}

function get(url, params, data, success, fail) {
  axio(url, "GET", data, params, success, fail)
}

function post(url, param, data, success, fail) {
  axio(url, "POST", data, param, success, fail)
}

export default {
  get,
  post,
}
