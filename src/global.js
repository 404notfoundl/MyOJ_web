/*
 * @Author:
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-26 11:11:37
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
      let timer = null
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
     *
     * @param {*} ms 延时，毫秒
     * @returns promise
     */
    ojTimer(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
        return true
      })
    },
    saveMdBorwser(type, name, obj) {
      let solutions = this.getLocalJson("markdown")
      if (solutions === null) solutions = {}
      if (solutions[type] == undefined) solutions[type] = {}

      let solution = solutions[type]
      //储存题解
      if (solution[name] === undefined) solution[name] = {}
      solution[name] = obj
      this.setLocalJson("markdown", solutions)
      this.toast("已保存至浏览器", 5000)
    },
    getMdBorwser(type, name) {
      let solutions = this.getLocalJson("markdown")
      if (
        solutions !== null &&
        solutions[type] !== undefined &&
        solutions[type][name] !== undefined
      )
        return solutions[type][name]
      else return { value: "" }
    },
    saveMdLocal(value) {
      this.downLoadDataToLoc(this.value)
      this.toast("已保存至本地存储", 5000)
    },
    downLoadDataToLoc(saveDatas) {
      // 创建一个blob的对象，把Json转化为字符串作为我们的值
      var blob = new Blob([saveDatas])
      if ("msSaveOrOpenBlob" in navigator) {
        // 这个判断要不要都行，如果是IE浏览器，使用的是这个，
        window.navigator.msSaveOrOpenBlob(blob, "results.txt")
      } else {
        // 不是IE浏览器使用的下面的
        var url = window.URL.createObjectURL(blob)
        // 上面这个是创建一个blob的对象连链接，
        var link = document.createElement("a")
        // 创建一个链接元素，是属于 a 标签的链接元素，所以括号里才是a，
        link.href = url
        // 把上面获得的blob的对象链接赋值给新创建的这个 a 链接
        link.setAttribute("download", "unnamed.md")
        // 设置下载的属性（所以使用的是download），这个是a 标签的一个属性
        // 后面的是文件名字，可以更改
        link.click()
        // 使用js点击这个链接
      }
    },
  },
  computed: {
    isAdmin: function () {
      let userinfo = this.userInfo
      // if (userinfo === null) {
      //   userinfo = this.getUserInfo()
      // }
      return userinfo !== null && userinfo.isAdmin
    },
    isAuthed: function () {
      let res = this.userInfo
      // if (!res) res = this.getUserInfo()
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
    route: function () {
      return this.$route
    },
  },
}
