<template lang="">
  <div class="row align-items-center bg-white" :style="`height:${avalHeight}px`">
    <div class="col-4 h-100 bg-1 border-right shadow">
      <div class="row h-25 align-items-center justify-content-center">
        <div class="col-6">
          <h1>logo</h1>
        </div>
      </div>
      <div class="row h-75">
        <div class="col-12">
          <!-- 此处加题库标签及数量 -->
          <wordcloud
            :gramHeight="`${avalHeight * 0.5}px`"
            :data="wordCloudChartData"
            gramShape="triangle-forward"
          >
          </wordcloud>
        </div>
      </div>
    </div>
    <div class="col-8 h-100">
      <div class="row align-items-center justify-content-center h-100">
        <div class="col-6 max-size pr-5 h-auto">
          <b-card
            class="shadow backdrop-blur"
            border-variant="info"
            bg-variant="light"
            :title="isRegist ? '注册' : '登录'"
          >
            <b-row no-gutters>
              <b-col lg="12">
                <!-- 登录界面 -->
                <div v-show="!isRegist">
                  <b-form @submit.prevent="loginAccount">
                    <b-form-group>
                      <b-row class="h-100 align-items-center">
                        <b-col md="2" class="pr-0">
                          <label>邮箱:</label>
                        </b-col>
                        <b-col md="10" class="pl-0">
                          <b-form-input
                            v-model.trim="usrAccount.email"
                            type="email"
                            placeholder="输入邮箱"
                            required
                          >
                          </b-form-input>
                        </b-col>
                      </b-row>
                    </b-form-group>
                    <b-form-group>
                      <b-row class="h-100 align-items-center">
                        <b-col md="2" class="pr-0">
                          <label>密码:</label>
                        </b-col>
                        <b-col md="10" class="pl-0">
                          <b-form-input
                            v-model.trim="usrAccount.passWord"
                            type="password"
                            placeholder="输入密码"
                            required
                          >
                          </b-form-input>
                        </b-col>
                      </b-row>
                    </b-form-group>
                    <b-button type="submit" variant="primary" block>登录</b-button>
                  </b-form>
                </div>

                <!-- 注册界面 -->
                <div v-show="isRegist">
                  <b-form @submit.prevent="registAccount">
                    <!-- 用户名 还需要做用户名检测 -->
                    <b-form-group>
                      <b-row class="h-100 align-items-center">
                        <b-col md="2" class="pr-0">
                          <label>用户名:</label>
                        </b-col>
                        <b-col md="10" class="pl-0">
                          <b-form-input
                            v-model.trim="usrAccount.name"
                            placeholder="输入用户名"
                            required
                          ></b-form-input>
                        </b-col>
                      </b-row>
                    </b-form-group>
                    <!-- 邮箱 -->
                    <b-form-group>
                      <b-row class="h-100 align-items-center">
                        <b-col md="2" class="pr-0">
                          <label>邮箱:</label>
                        </b-col>
                        <b-col md="10" class="pl-0">
                          <b-form-input
                            v-model.trim="usrAccount.email"
                            type="email"
                            placeholder="输入邮箱"
                            required
                          >
                          </b-form-input>
                        </b-col>
                      </b-row>
                    </b-form-group>
                    <!-- 密码 -->
                    <b-form-group>
                      <b-row class="h-100 align-items-center">
                        <b-col md="2" class="pr-0">
                          <label>密码:</label>
                        </b-col>
                        <b-col md="10" class="pl-0">
                          <b-form-input
                            id="pwd"
                            v-model.trim="usrAccount.passWord"
                            type="password"
                            placeholder="输入密码"
                            @blur="checkPwdVaild(0)"
                            @focus="hidePopover(0)"
                            required
                          ></b-form-input>
                        </b-col>
                      </b-row>
                    </b-form-group>
                    <!-- 确认密码 -->
                    <b-form-group>
                      <b-row class="h-100 align-items-center">
                        <b-col md="2" class="pr-0">
                          <label>确认<br />密码:</label>
                        </b-col>
                        <b-col md="10" class="pl-0">
                          <b-form-input
                            id="confirm"
                            v-model.trim="confirmPwd"
                            type="password"
                            placeholder="再次输入密码"
                            @blur="checkPwdVaild(1)"
                            @focus="hidePopover(1)"
                            required
                            :disabled="!isPwdVaild"
                          >
                          </b-form-input>
                        </b-col>
                      </b-row>
                    </b-form-group>
                    <!-- 注册 -->
                    <b-button type="submit" variant="primary" block :disabled="!activeButton"
                      >注册</b-button
                    >
                  </b-form>
                  <b-popover ref="pwdPopover" target="pwd" title="密码要求" :disabled="true">
                    密码需要由字母，下划线开头，且只包含字母，下划线，数字的8到16位字符组成
                  </b-popover>
                  <b-popover
                    ref="confirmPwdPopover"
                    target="confirm"
                    title="密码要求"
                    :disabled="true"
                  >
                    密码不相同
                  </b-popover>
                </div>
                <!-- 切换注册登录页面 -->
                <b-row class="justify-content-end">
                  <b-col md="2">
                    <a
                      href="#"
                      style="font-size: 0.8rem; display: block"
                      @click="toRegister"
                      class="text-decoration-none"
                      >{{ isRegist ? "登录" : "注册" }}</a
                    >
                  </b-col>
                </b-row>
                <!-- 消息提示 -->
                <b-modal id="login-info" centered>
                  <div v-for="(value, key, index) in responseInfo" :key="index">
                    <b-row>
                      <b-col cols="3"
                        ><p class="h6">{{ infoMap[key] }}:</p></b-col
                      >
                      <b-col
                        ><p class="h6">{{ value }}</p></b-col
                      >
                    </b-row>
                  </div>
                </b-modal>
              </b-col>
            </b-row>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import wordCloud from "./wordCloudGram"
export default {
  name: "login",
  components: {
    wordcloud: wordCloud,
  },
  computed: {
    // avalHeight: function () {
    //   return this.$store.state.avaliableHeight
    // },
    activeButton: function () {
      let res = this.isPwdEqual & this.isPwdVaild
      if (this.usrAccount.email !== "" && this.usrAccount.name !== "") res &= true
      else res &= false
      return res
    },
  },
  props: {},
  data() {
    this.infoMap = {
      username: "用户名",
      email: "邮箱",
      password: "密码",
    }
    return {
      wordCloudChartData: {
        columns: ["word", "count"],
        rows: [],
      },
      usrAccount: {
        name: "",
        email: "",
        passWord: "",
      },
      responseInfo: {
        key: "value",
      },
      confirmPwd: "",
      isPwdVaild: false,
      isPwdEqual: false,
      isRegist: false, //切换注册登录页面
    }
  },
  watch: {
    isRegist: {
      handler(val) {
        if (val) {
          // console.log(this.$refs.pwdPopover)
          // this.$refs.pwdPopover.show = true
        }
      },
    },
  },
  methods: {
    toRegister() {
      this.isRegist = !this.isRegist
    },
    registAccount() {
      let newUser = this.usrAccount
      this.$axios({
        url: this.$store.state.webUrl.register,
        method: "POST",
        data: {
          username: newUser.name,
          email: newUser.email,
          password: newUser.passWord,
        },
      })
        .then(() => {
          this.toRegister()
        })
        .catch((err) => {
          this.responseInfo = err.response.data.result
          this.$bvModal.show("login-info")
        })
    },
    loginAccount: function () {
      let user = this.usrAccount
      if (user.name === "") delete user.name
      this.$axios({
        url: `${this.$store.state.webUrl.user.login}`,
        method: "POST",
        data: {
          username: user.email,
          password: user.passWord,
          mode: "email",
        },
      })
        .then((response) => {
          let data = response.data
          // this.setLocalJson(username, data)
          this.$store.commit("setUserInfo", data)
          this.$router.push({ name: "newSolutions" })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    hidePopover(b) {
      if (b == 0) this.$refs.pwdPopover.$emit("close")
      else if (b == 1) this.$refs.confirmPwdPopover.$emit("close")
    },
    checkPwdVaild(b) {
      if (b == 0) {
        let par = /^[a-zA-Z_]\w{7,15}$/
        if (par.test(this.usrAccount.passWord) != true) {
          // debugger
          this.isPwdVaild = false
          this.$refs.pwdPopover.$emit("open")
          // console.log('invaild')
        } else {
          this.isPwdVaild = true
        }
      } else if (b == 1) {
        if (this.usrAccount.passWord == this.confirmPwd) {
          this.isPwdEqual = true
        } else {
          this.$refs.confirmPwdPopover.$emit("open")
          this.isPwdEqual = false
        }
      }
      // _TestABCDEFGHIJK
    },
    getRows: async function () {
      return await this.$axios({
        url: this.$store.state.webUrl.label,
        method: "GET",
        // headers: {
        //   authorization: `Bearer ${info.token}`,
        // },
      })
        .then((response) => {
          return response.data
        })
        .catch((err) => {
          // debugger
          console.log(err)
        })
      //#region
      // return [
      //   {
      //     word: "visualMap",
      //     count: 22199,
      //   },
      //   {
      //     word: "continuous",
      //     count: 10288,
      //   },
      //   {
      //     word: "contoller",
      //     count: 620,
      //   },
      //   {
      //     word: "series",
      //     count: 274470,
      //   },
      //   {
      //     word: "gauge",
      //     count: 12311,
      //   },
      //   {
      //     word: "detail",
      //     count: 1206,
      //   },
      //   {
      //     word: "piecewise",
      //     count: 4885,
      //   },
      //   {
      //     word: "textStyle",
      //     count: 32294,
      //   },
      //   {
      //     word: "markPoint",
      //     count: 18574,
      //   },
      //   {
      //     word: "pie",
      //     count: 38929,
      //   },
      //   {
      //     word: "roseType",
      //     count: 969,
      //   },
      //   {
      //     word: "label",
      //     count: 37517,
      //   },
      //   {
      //     word: "emphasis",
      //     count: 12053,
      //   },
      //   {
      //     word: "yAxis",
      //     count: 57299,
      //   },
      //   {
      //     word: "name",
      //     count: 15418,
      //   },
      //   {
      //     word: "type",
      //     count: 22905,
      //   },
      //   {
      //     word: "gridIndex",
      //     count: 5146,
      //   },
      //   {
      //     word: "normal",
      //     count: 49487,
      //   },
      //   {
      //     word: "itemStyle",
      //     count: 33837,
      //   },
      //   {
      //     word: "min",
      //     count: 4500,
      //   },
      //   {
      //     word: "silent",
      //     count: 5744,
      //   },
      //   {
      //     word: "animation",
      //     count: 4840,
      //   },
      //   {
      //     word: "offsetCenter",
      //     count: 232,
      //   },
      //   {
      //     word: "inverse",
      //     count: 3706,
      //   },
      //   {
      //     word: "borderColor",
      //     count: 4812,
      //   },
      //   {
      //     word: "markLine",
      //     count: 16578,
      //   },
      //   {
      //     word: "line",
      //     count: 76970,
      //   },
      //   {
      //     word: "radiusAxis",
      //     count: 6704,
      //   },
      //   {
      //     word: "radar",
      //     count: 15964,
      //   },
      //   {
      //     word: "data",
      //     count: 60679,
      //   },
      //   {
      //     word: "dataZoom",
      //     count: 24347,
      //   },
      //   {
      //     word: "tooltip",
      //     count: 43420,
      //   },
      //   {
      //     word: "piecewise",
      //     count: 4885,
      //   },
      //   {
      //     word: "textStyle",
      //     count: 32294,
      //   },
      //   {
      //     word: "markPoint",
      //     count: 18574,
      //   },
      //   {
      //     word: "pie",
      //     count: 38929,
      //   },
      //   {
      //     word: "roseType",
      //     count: 969,
      //   },
      //   {
      //     word: "label",
      //     count: 37517,
      //   },
      //   {
      //     word: "emphasis",
      //     count: 12053,
      //   },
      //   {
      //     word: "yAxis",
      //     count: 57299,
      //   },
      //   {
      //     word: "name",
      //     count: 15418,
      //   },
      //   {
      //     word: "type",
      //     count: 22905,
      //   },
      //   {
      //     word: "gridIndex",
      //     count: 5146,
      //   },
      //   {
      //     word: "normal",
      //     count: 49487,
      //   },
      //   {
      //     word: "itemStyle",
      //     count: 33837,
      //   },
      //   {
      //     word: "min",
      //     count: 4500,
      //   },
      //   {
      //     word: "silent",
      //     count: 5744,
      //   },
      //   {
      //     word: "animation",
      //     count: 4840,
      //   },
      //   {
      //     word: "offsetCenter",
      //     count: 232,
      //   },
      //   {
      //     word: "inverse",
      //     count: 3706,
      //   },
      //   {
      //     word: "borderColor",
      //     count: 4812,
      //   },
      // ]
      //#endregion
    },
  },
  created: async function () {
    // console.log(JSON.parse(null))
    let wordCloudObj = this.getLocalJson("ojWordCloud")
    if (wordCloudObj == null) {
      wordCloudObj = {}
      wordCloudObj["words"] = await this.getRows()
      wordCloudObj["date"] = new Date().format("yyyy-MM-dd")
      this.setLocalJson("ojWordCloud", wordCloudObj)
    } else {
      if (new Date().format("yyyy-MM-dd") !== wordCloudObj["date"]) {
        console.log("update words")
        wordCloudObj["words"] = await this.getRows()
        wordCloudObj["date"] = new Date().format("yyyy-MM-dd")
        this.setLocalJson("ojWordCloud", wordCloudObj)
      } else {
        // console.log("use local words")
      }
    }
    // debugger
    this.wordCloudChartData.rows = wordCloudObj.words
    this.wordCloudChartData.rows.push({ word: "OJ", count: this.wordCloudChartData.rows.length })
  },
  mounted() {},
  updated() {},
}
</script>
<style scoped>
.h-60 {
  height: 60%;
}

.bg-1 {
  background: rgb(246, 248, 250);
}

.bg-white {
  background-color: whitesmoke;
}

.align-center {
  position: absolute;
  top: 20%;
}

.max-size {
  max-width: 500px !important;
  max-height: 300px !important;
}

label {
  margin-bottom: 0 !important;
}
</style>
