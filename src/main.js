/*
 * @Author:
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-06 17:02:22
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
import VePie from "v-charts/lib/pie.common"
//editor
import ace from "ace-builds"
//全局方法
import mixin from "./global"
//axios
import axios from "axios"
import qs from "qs"

import vueAwesomeCountdown from "vue-awesome-countdown"
// element-ui
import { steps, step } from "element-ui"

import "http"
import VueClipboards from "vue-clipboard2"

// Optionally install the BootstrapVue icon components plugin
Vue.use(VueClipboards)
Vue.use(ace)
Vue.use(vueAwesomeCountdown, "countdown") // Component name, `countdown` and `vac` by default
Vue.use(PortalVue)
Vue.use(IconsPlugin)
Vue.use(BootstrapVue) //BootstrapVue
Vue.use(MavonEditor) //markdown -- mavon
Vue.use(steps)
Vue.use(step)
MavonEditor.mavonEditor
  .getMarkdownIt()
  .use(Md_Katex, { blockClass: "math-block", errorColor: " #cc0000" }) //实时渲染Latex
Vue.component(VeWordCloud.name, VeWordCloud) //词云
Vue.component(Vehistogram.name, Vehistogram) //柱状图
// Vue.component(VeLiquidfill.name, VeLiquidfill) //水球图
Vue.component(VePie.name, VePie)
Vue.config.productionTip = false
Vue.mixin(mixin) //全局方法
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
