/*
 * @Author:
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-15 13:56:35
 * @Description: 请填写简介
 */
export default {
  methods: {
    /**
     * @description: 延时执行的方法
     * @param {*} fn 待执行函数
     * @param {*} wait 延时时间(ms)
     * @return {*}
     */
    ojDebounce(fn, wait) {
      //防止重复调用
      var timer = null
      return function () {
        if (timer !== null) {
          clearTimeout(timer)
        }
        // debugger
        timer = setTimeout(fn, wait)
      }
    },
    deleteLocal(name) {
      window.localStorage.removeItem(name)
    },
    setLocalString(name, str) {
      window.localStorage.setItem(name, str)
    },
    getLocalString(name) {
      return window.localStorage.getItem(name)
    },
    setLocalJson(name, obj) {
      window.localStorage.setItem(name, JSON.stringify(obj))
    },
    getLocalJson(name) {
      return JSON.parse(this.getLocalString(name))
    },
    getUserInfo() {
      let info = this.$store.state.userInfo
      if (!info) {
        info = this.getLocalJson("user")
        this.$store.commit("setUserInfo", info)
      }
      return info
    },
    toast(data, delay = 5000) {
      this.$bvToast.toast(data, {
        title: "结果",
        autoHideDelay: delay,
      })
    },

    /**
     * @description: 检测用户权限
     * @param {*}
     * @return {*}
     */
    // 暂时不要删
    // checkValid() {
    //   return true
    // },
  },
  computed: {
    isAdmin: function () {
      let userinfo = this.$store.state.userInfo
      if (userinfo === null) {
        userinfo = this.getUserInfo()
      }
      return userinfo !== null && userinfo.isAdmin
    },
    isAuthed: function () {
      let res = this.$store.state.userInfo
      if (!res) res = this.getUserInfo()
      return Boolean(res)
    },
    userInfo() {
      let userInfo = this.$store.state.userInfo
      if (userInfo === null) userInfo = this.getUserInfo()
      return userInfo
    },
    avalHeight: function () {
      return this.$store.state.avaliableHeight
    },
  },
}
