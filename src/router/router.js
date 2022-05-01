/*
 * @Author:
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-28 08:54:38
 * @Description: 请填写简介
 */
//注意参数next需要调用，否则出现意外
//引入vue
import Vue from "vue"
//引入vue-router
import VueRouter from "vue-router"
import GlobalMethod from "@/global"
import store from "@/store/index"
//axios
import axios from "axios"
//第三方库需要use一下才能用
Vue.use(VueRouter)
// //引用页面
// import loginPage from '@/components/login'
// import codeEditor from '@/components/CodeEditor'
// import markDown from '@/components/MdDemo'
// import personalDetails from '@/components/personalDetails'
// import notFound from '@/components/404Page'
// import problemLib from '@/components/problemLib'
// import problem from '@/components/problem'
// import problemModifyer from '@/components/modifyProblem'
// import problemObj from "@/components/problem"
//路由懒加载
const codeEditor = () => import("@/components/CodeEditor")
const loginPage = () => import("@/components/login")
const markDown = () => import("@/components/MdDemo")
const personalDetails = () => import("@/components/personalDetails")
const notFound = () => import("@/components/404Page")
//需要打到一个包里去,魔法注释不能删
const problemLib = () => import(/* webpackChunkName: 'prob_lib' */ "@/components/problemLib")
const problemObj = () => import(/* webpackChunkName: 'prob_lib' */ "@/components/problem")
const problemModifyer = () => import("@/components/modifyProblem")
const solution = () => import("@/components/solutionPage")
const checkSolution = () => import("@/components/checkSolution")
const competitionList = () =>
  import(/* webpackChunkName: 'comp_list' */ "@/components/competitionList")
const competitionPage = () =>
  import(/* webpackChunkName: 'comp_list' */ "@/components/competitionPage")
// const competitionProblem = () =>
//   import(/* webpackChunkName: 'comp_list' */ "@/components/competitionProblem") // 原题目页太多了，有待更改
const appendCompetition = () =>
  import(/* webpackChunkName: 'comp_list' */ "@/components/addCompetitionPage")
// 测试页
const testPage = () => import("@/components/editProblemPage")
//默认提交表单
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"
axios.defaults.headers.get["Content-Type"] = "application/x-www-form-urlencoded"
axios.defaults.transformRequest = [
  function (data) {
    let ret = ""
    // debugger
    for (let it in data) {
      ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&"
    }
    return ret
  },
]
//定义routes路由的集合，数组类型
const routes = [
  //单个路由均为对象类型，path代表的是路径，component代表组件
  { name: "main", path: "/", redirect: { name: "newSolutions" } }, //主页面
  {
    name: "appendProblem",
    path: "/append_problem",
    component: problemModifyer,
    props: { mode: "append" }, //添加题目
  },
  { name: "codeEditor", path: "/code_editor", component: codeEditor }, //代码编辑器
  { name: "checkSolution", path: "/ckeck_solution", component: checkSolution }, //审核题解
  { name: "markdown", path: "/markdown", component: markDown, props: true }, //markdown页面
  { name: "modifyProblem", path: "/modify_problem/:pid", component: problemModifyer, props: true }, //修改题目
  { name: "login", path: "/login", component: loginPage, props: true }, //登录
  { name: "newSolutions", path: "/news", component: solution }, //最新题解
  { name: "problemObj", path: "/problem_lib/:pid", component: problemObj }, //题目
  { name: "probLib", path: "/problem_lib", component: problemLib }, //题目列表
  {
    name: "solution",
    path: "/solution/:pid",
    component: solution,
    props: { showMode: "solution" },
  }, // 题解
  { name: "addCompetition", path: "/appendCompetition", component: appendCompetition }, // 添加比赛页
  { name: "competitionList", path: "/competition", component: competitionList }, // 比赛列表
  { name: "competitionPage", path: "/competition/:cid", component: competitionPage }, // 比赛详情页
  { name: "competitionProblem", path: "/competition/:cid/:pid", component: problemObj }, // 比赛题目详情页

  { name: "usrInfo", path: "/usr_info/:uid", component: personalDetails }, // 个人信息
  // 测试新页面
  { name: "testPage", path: "/test_page", component: testPage }, // 个人信息

  //404页面需要放在最后
  { name: "404", path: "/404", component: notFound },
  { path: "*", redirect: "/404" },
]

//实例化VueRouter并将routes添加进去
const router = new VueRouter({
  mode: "history",
  //ES6简写，等于routes：routes
  routes,
})
//需要认证的页面
let authPage = {
  modifyProblem: "modifyProblem",
  usrInfo: "usrInfo",
  appendProblem: "appendProblem",
  checkSolution: "checkSolution",
}

//路由守卫
router.beforeEach(async (to, from, next) => {
  //有待验证登录
  let pass = true
  // console.log(to.name)
  if (authPage[to.name] === to.name) {
    let info = GlobalMethod.methods.getLocalJson("user")
    console.log(this)
    if (!info) pass = false
    else {
      await axios({
        url: store.state.webUrl.user.verify,
        method: "POST",
        data: { token: info.token },
      })
        .then(() => {
          pass = true
          // console.log("pass!")
        })
        .catch(() => {
          pass = false
          // console.log("unauthed!")
        })
    }
  }
  if (!pass) next({ name: "login" })
  else next()
})

//抛出这个这个实例对象方便外部读取以及访问
export default router
