/*
 * @Author:
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-07 21:07:28
 * @Description: 请填写简介
 */
import Vue from "vue"
import Vuex from "vuex"
import GlobalMethod from "@/global"
//挂载Vuex
Vue.use(Vuex)

//这是全局变量所用
//创建VueX对象
let root = "http://127.0.0.1:8000"
let site_root = "http://121.41.31.72:8008"
// root = site_root
const store = new Vuex.Store({
  strict: true,
  state: {
    //存放的键值对就是所要管理的状态
    avaliableHeight: 0, //可用的高度
    userInfo: null,
    // userinfo 格式
    // {
    //   refresh: "",
    //   token: "",
    //   uid: 1,
    //   isAdmin: true,
    //   username: "admin",
    //   avatarUrl:""
    // },
    isTop: true, //是否在顶部
    isBottom: false, //是否在底部
    //后端地址
    webUrl: {
      root,
      get problems() {
        return `${this.root}/api/problems/`
      },
      get save() {
        return `${this.root}/api/save/`
      },
      get test() {
        return `${this.root}/api/test/`
      },
      get label() {
        return `${this.root}/api/labels/`
      },
      competition: {
        self: `${root}/api/competition`,
        get problem() {
          return `${this.self}_problems/`
        },
        get rank() {
          return `${this.self}_rank/`
        },
      },
      solution: {
        self: `${root}/solution`,
        get check() {
          return `${this.self}/check/`
        },
        get preview() {
          return `${this.self}/preview/`
        },
        get submit() {
          return `${this.self}/submit/`
        },
      },
      task: {
        self: `${root}/task`,
        get submit() {
          return `${this.self}/submit/`
        },
        get preview() {
          return `${this.self}/preview/`
        },
        get competition() {
          return `${this.self}/competition/`
        },
      },
      user: {
        self: `${root}/user`,
        get login() {
          return `${this.self}/login/`
        },
        get refresh() {
          return `${this.self}/refresh/`
        },
        get verify() {
          return `${this.self}/verify/`
        },
        get register() {
          return `${this.self}/register/`
        },
        get info() {
          return `${this.self}/info/` // info/xxx/
        },
        get details() {
          return `${this.self}/details/` // details/xxx/
        },
      },
      provincial_competition: {
        self: `${root}/api/provincial_competition`,
      },
    },
  },
  mutations: {
    setAvalHeight(state, params) {
      state.avaliableHeight = params
      // debugger
      // console.log(params)
    },
    setTopState(state, value) {
      state.isTop = value
    },
    setUserInfo(state, info, flag = true) {
      if (info != null && info.avatarUrl == "") info.avatarUrl = require("../assets/Akkarin.png")
      state.userInfo = info
      if (flag) GlobalMethod.methods.setLocalJson("user", info)
      // this.setLocalJson("user", info)
    },
    setBottomState(state, value) {
      state.isBottom = value
    },
  },
})

export default store
