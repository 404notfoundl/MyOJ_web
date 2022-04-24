/*
 * @Author:
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-22 15:08:39
 * @Description: 请填写简介
 */
// app.js
import Vue from "vue"
import App from "./App.vue"
import { BootstrapVue, IconsPlugin } from "bootstrap-vue"
import "./sass/custom.scss"
import PortalVue from "portal-vue"
import router from "./router/router"
//以下均是md所需
import MavonEditor from "mavon-editor"
import "mavon-editor/dist/css/index.css"
import Md_Katex from "@traptitech/markdown-it-katex"
//vuex 全局变量
import store from "./store/index"
//图表
import Vehistogram from "v-charts/lib/histogram.common"
import VeWordCloud from "v-charts/lib/wordcloud.min"
import VeLiquidfill from "v-charts/lib/liquidfill.common"
//editor
import ace from "ace-builds"
Vue.use(ace)
//全局方法
import mixin from "./global"
//axios
import axios from "axios"
import qs from "qs"

import vueAwesomeCountdown from 'vue-awesome-countdown'

// Optionally install the BootstrapVue icon components plugin
Vue.use(vueAwesomeCountdown, 'countdown') // Component name, `countdown` and `vac` by default
Vue.use(PortalVue)
Vue.use(IconsPlugin)
Vue.use(BootstrapVue) //BootstrapVue
Vue.use(MavonEditor) //markdown -- mavon
MavonEditor.mavonEditor
  .getMarkdownIt()
  .use(Md_Katex, { blockClass: "math-block", errorColor: " #cc0000" }) //实时渲染Latex
Vue.component(VeWordCloud.name, VeWordCloud) //词云
Vue.component(Vehistogram.name, Vehistogram) //柱状图
Vue.component(VeLiquidfill.name, VeLiquidfill) //水球图
Vue.config.productionTip = false
Vue.mixin(mixin) //全局方法
//默认提交表单
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8"
axios.defaults.headers.get["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8"
axios.defaults.headers.delete["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8"
// 下面暂时不要删
// axios.defaults.transformRequest = [function (data) {
//     let ret = ''
//     for (let it in data) {
//       ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//     }
//     debugger
//     return ret
// }]
//axios
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
new Vue({
  router,
  store,
  render: (h) => h(App),
  components: {
    App,
  },
}).$mount("#app")
// TODO 由于边学边用，许多东西都没有改，有待修改
