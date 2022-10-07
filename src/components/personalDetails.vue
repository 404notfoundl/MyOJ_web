<template>
  <div
    :style="'height:' + ojPageHeight + 'px'"
    class="w-100"
    :key="$route.params.uid"
  >
    <!-- 上半部分 -->
    <div class="row h-25 w-100 justify-content-center pt-1">
      <div class="col-lg-8 h-100 px-0 position-relative">
        <div class="position-center h-100 z-4 w-100 pb-5">
          <!-- TODO 此部分计划显示用户通过题目标签及数量 -->
          <wordcloud
            :gramHeight="ojPageHeight * 0.25 + 'px'"
            gramShape="pentagon"
            :data="wordCloudChartData"
          ></wordcloud>
        </div>
        <b-card class="h-100 w-100 py-0 position-relative">
          <div class="row h-100 align-items-end">
            <div class="w-auto h-auto col-2 position-relative">
              <b-avatar
                variant="light"
                :size="avartarSize"
                class="pr-0 z-2"
                :src="userDetail.avatarUrl"
              ></b-avatar>
            </div>
            <div class="col-2 h-auto">
              <div class="row w-100 justify-content-start">
                <b>
                  <h1 class="h1 text-left">{{ userDetail.username }}</h1>
                  <p class="h6 text-left font-weight-light text-muted">
                    {{ submitInfo.email }}
                  </p>
                </b>
              </div>
            </div>
            <!-- 通过，提交数 -->
            <div class="col-8">
              <div class="row h-20 justify-content-end">
                <div class="col-6">
                  <div class="row justify-content-end position-relative">
                    <div class="form-check-inline">
                      <div class="col-6">
                        <p>通过数</p>
                        <p>{{ userDetail.acceptNum }}</p>
                        <!-- <span class="t-center">
                        </span> -->
                      </div>
                      <div class="col-6">
                        <p>提交数</p>
                        <p>{{ userDetail.submitNum }}</p>
                        <!-- <span class="t-center">
                        </span> -->
                      </div>
                    </div>
                    <div class="col-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card>
      </div>
    </div>
    <!-- 下半部分 -->
    <div class="row h-auto w-100 justify-content-center pt-3">
      <div class="col-lg-8 h-100 px-0">
        <b-card class="h-100 w-100">
          <hr class="mb-0" />
          <b-tabs
            content-class="mt-3 border-left"
            vertical
            lazy
            pills
            nav-class="mt-3"
            v-model="currentTabIndex"
          >
            <!-- 基本信息 -->
            <b-tab active title="基本信息">
              <div class="row justify-content-center h-100">
                <div class="col-6" v-if="false">
                  <achistogram></achistogram>
                </div>
                <div class="col-6">
                  <acpercent
                    :accept_num="userDetail.acceptNum"
                    :submit_num="userDetail.submitNum"
                  ></acpercent>
                </div>
              </div>
              <!-- <div class="col-9">
                  </div> -->
            </b-tab>
            <b-tab title="通过题目">
              <b-row>
                <div
                  class="float-left mx-3 my-1"
                  cols="2"
                  v-for="(item, index) in userAcs"
                  :key="index"
                >
                  <b-link
                    :to="{ name: 'problemObj', params: { pid: item.name } }"
                    >{{ item.name }}</b-link
                  >
                </div>
              </b-row>
            </b-tab>
            <!-- 仅自己才可以操作 -->
            <div v-if="isSelf">
              <b-tab title="修改个人信息">
                <b-form @submit.prevent="submitUserinfo">
                  <b-form-group>
                    <b-row>
                      <b-col cols="8" style="text-align: left">
                        <b-col cols="3" class="d-inline-block">
                          <label>用户名:</label>
                        </b-col>
                        <div class="d-inline-block">
                          <b-form-input
                            v-model.lazy.trim="submitInfo.username"
                            placeholder=""
                            required
                            disabled
                          >
                          </b-form-input>
                        </div>
                      </b-col>
                      <b-col cols="8" style="text-align: left">
                        <b-col cols="3" class="d-inline-block">
                          <label>邮箱:</label>
                        </b-col>
                        <div class="d-inline-block">
                          <b-form-input
                            v-model.lazy.trim="submitInfo.email"
                            placeholder=""
                            required
                            disabled
                          >
                          </b-form-input>
                        </div>
                      </b-col>
                      <b-col cols="8" style="text-align: left">
                        <b-col cols="3" class="d-inline-block">
                          <label>头像url:</label>
                        </b-col>
                        <div class="d-inline-block">
                          <b-form-input
                            v-model.lazy.trim="submitInfo.avatarUrl"
                            placeholder="输入头像url"
                            required
                          >
                          </b-form-input>
                        </div>
                      </b-col>
                    </b-row>
                  </b-form-group>
                  <b-form-group>
                    <b-row>
                      <b-col cols="8" style="text-align: right">
                        <b-button type="submit" variant="outline-primary"
                          >提交</b-button
                        >
                      </b-col>
                    </b-row>
                  </b-form-group>
                </b-form>
              </b-tab>
              <b-tab title="自定义词云图">
                <b-col class="t-left pl-0">
                  <label><b>自定义词云图</b></label>
                </b-col>
                <!-- 表头 -->
                <b-col cols="8" class="t-left">
                  <b-row class="row-input">
                    <b-col class="px-0">
                      <b-form-input
                        placeholder="名称 (长度<10)"
                        disabled
                        class="br-0 pl-1 bb-0"
                      >
                      </b-form-input>
                    </b-col>
                    <b-col class="px-0">
                      <b-form-input
                        placeholder="值 (0~9999)"
                        disabled
                        class="br-0 pl-1 bb-0 bl-0"
                      >
                      </b-form-input>
                    </b-col>
                  </b-row>
                </b-col>
                <!-- 内容 -->
                <b-form @submit.prevent="submitUserWordCloud">
                  <b-form-group
                    v-for="(item, index) in userWordCloud"
                    :key="item.id"
                    class="mb-0"
                  >
                    <b-col cols="8" class="t-left">
                      <b-row class="row-input">
                        <b-col class="px-0">
                          <b-form-input
                            v-model.lazy.trim="item.word"
                            placeholder="key"
                            :required="userWordCloud.length - 1 != index"
                            class="br-0 pl-1"
                            @blur="addItem(index)"
                            :state="validateInput(index, true)"
                          >
                          </b-form-input>
                        </b-col>
                        <b-col class="px-0">
                          <b-form-input
                            v-model.lazy="item.count"
                            placeholder="value"
                            :required="userWordCloud.length - 1 != index"
                            class="br-0 pl-1 bl-0"
                            @blur="addItem(index)"
                            :state="validateInput(index, false)"
                          >
                          </b-form-input>
                        </b-col>
                        <b-button
                          class="on-show fixed-right py-1"
                          variant="delete"
                          @click="removeItem(index)"
                          v-show="userWordCloud.length > 1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-x-lg"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                            />
                          </svg>
                        </b-button>
                      </b-row>
                    </b-col>
                  </b-form-group>
                  <b-form-group class="mt-2">
                    <b-row>
                      <b-col cols="8" style="text-align: right">
                        <b-button type="submit" variant="outline-primary"
                          >提交</b-button
                        >
                      </b-col>
                    </b-row>
                  </b-form-group>
                </b-form>
              </b-tab>
            </div>
            <b-tab title="禁用" v-if="false"><p>I'm a disabled tab!</p></b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
import AcPercentChart from "./usrACPercentage"
import AcHistogram from "./usrACHistogram"
import wordCloud from "./wordCloudGram"
import { nanoid } from "nanoid"

export default {
  name: "usrInfo",
  components: {
    acpercent: AcPercentChart,
    achistogram: AcHistogram,
    wordcloud: wordCloud,
  },
  computed: {
    avartarSize: function () {
      return (this.ojPageHeight * 0.1 <= 50 ? 50 : this.ojPageHeight * 0.1) + "px"
    },
    isSelf () {
      return this.$route.params.uid == this.userInfo.uid
    },
    uid () {
      return this.$route.params.uid
    },
  },
  async created () {
    // TODO 暂未完成
    await this.getUserInfo()
    this.getRows()
    return true
  },
  data () {
    return {
      currentTabIndex: 0,
      ojPageHeight: this.$store.state.avaliableHeight,
      wordCloudChartData: {
        columns: ["word", "count"],
        rows: [],
      },
      userDetail: {
        acceptNum: 0,
        submitNum: 0,
        username: "user",
        avatarUrl: require("../assets/Akkarin.png"),
      },
      submitInfo: {
        username: "",
        email: "",
        avatarUrl: "",
      },
      userAcs: [{ name: "" }],
      userWordCloud: [],
      submitWordCloud: {},
      isWordValid: 0,
      createFlag: true,
    }
  },
  methods: {
    getRows () {
      let info = this.userInfo
      this.$axios({
        url: `${this.$store.state.webUrl.user.details}`,
        method: "GET",
        params: {
          uid: this.uid,
          type: 3,
        },
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          if (response.data.length > 0 && response.data[0].value.length > 2) {
            let words = JSON.parse(response.data[0].value)
            for (let key in words) {
              this.wordCloudChartData.rows.push({ word: key, count: words[key] })
              this.userWordCloud.push({ word: key, count: words[key] })
              this.submitWordCloud[key] = words[key]
            }
            this.wordCloudChartData.rows.push({ word: this.userDetail.username, count: 9999 })
          } else {
            let wordCloudObj = this.getLocalJson("ojWordCloud").words
            if (wordCloudObj == null) wordCloudObj = [{ word: "oj", count: 9999 }]
            else wordCloudObj.push({ word: this.userDetail.username, count: 9999 })
            this.wordCloudChartData.rows = wordCloudObj
          }
          this.userWordCloud.push({ id: nanoid(), word: "", count: "" })
          if (response.data.length > 0)
            this.createFlag = false
          else
            this.createFlag = true
        })
        .catch((err) => {
          console.log(err)
        })
      // 默认
    },
    submitUserinfo () {
      let info = this.userInfo
      let data = {
        avatar_url: this.submitInfo.avatarUrl,
      }
      this.$axios({
        url: `${this.$store.state.webUrl.user.info}${this.$route.params.uid}/`,
        method: "PUT",
        data,
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          this.$bvToast.toast(`修改成功`, {
            title: "修改结果",
            autoHideDelay: 5000,
          })
          let data = this.getLocalJson("user")
          data.avatarUrl = this.submitInfo.avatarUrl
          this.$store.commit("setUserInfo", data)
          this.userInfo.avatarUrl = this.submitInfo.avatarUrl
          this.currentTabIndex = 0
        })
        .catch((err) => {
          console.log(err)
          this.currentTabIndex = 0
        })
    },
    async getUserInfo () {
      let info = this.userInfo
      await this.$axios({
        url: `${this.$store.state.webUrl.user.info}${this.$route.params.uid}/`,
        method: "GET",
        headers: {
          // "Content-Type": "multipart/form-data",
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          this.userDetail.acceptNum = response.data.accept_num
          this.userDetail.submitNum = response.data.submit_num
          this.userDetail.username = response.data.username
          this.submitInfo.username = response.data.username
          this.submitInfo.email = response.data.email
          if (response.data.avatar_url != "") this.userDetail.avatarUrl = response.data.avatar_url
          else this.userDetail.avatarUrl = require("../assets/Akkarin.png")
        })
        .catch((err) => {
          this.toast(err.response.data.result)
          if (err.response.status == 404) this.$router.push({ name: "404" })
          else this.$router.push({ name: "main" })
        })
        .finally(() => {
          return true
        })
    },
    getUserDetails () {
      let info = this.userInfo
      this.$axios({
        url: `${this.$store.state.webUrl.user.details}`,
        method: "GET",
        params: {
          uid: this.uid,
        },
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          this.userAcs = response.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    removeItem (index) {
      delete this.submitWordCloud[this.userWordCloud[index].word]
      this.userWordCloud.splice(index, 1)
    },
    addItem (index) {
      let last = this.userWordCloud.length - 1
      if (
        index == last &&
        (this.userWordCloud[last].word != "" || this.userWordCloud[last].count != "") &&
        this.userWordCloud.length < 21
      )
        this.userWordCloud.push({ id: nanoid(), word: "", count: "" })
    },
    validateInput (index, isKey) {
      if (this.userWordCloud[index].word == "" || this.userWordCloud[index].count == "") {
        this.isWordValid = this.isWordValid & ~(1 << index)
        return null
      }

      // 验证
      if (
        this.userWordCloud[index].word.length < 10 &&
        !isNaN(this.userWordCloud[index].count) &&
        this.userWordCloud[index].count < 10000 &&
        this.userWordCloud[index].count >= 0
      )
        this.isWordValid = this.isWordValid | (1 << index)
      else this.isWordValid = this.isWordValid & ~(1 << index)

      // 记录
      if (this.isWordValid & (1 << index))
        this.submitWordCloud[this.userWordCloud[index].word] = this.userWordCloud[index].count

      if (isKey) {
        return this.userWordCloud[index].word.length < 10
      } else {
        return !isNaN(this.userWordCloud[index].count) && this.userWordCloud[index].count < 10000
      }
    },
    submitUserWordCloud () {
      let dx = this.userWordCloud.length
      if (this.userWordCloud[dx - 1].word == "" && this.userWordCloud[dx - 1].count == "") dx--
      if (this.isWordValid != (1 << dx) - 1) {
        this.toast("请按要求填写", 3000)
        return
      }
      let info = this.userInfo
      let method = this.createFlag ? "POST" : "PUT"
      let url = this.createFlag
        ? `${this.$store.state.webUrl.user.details}`
        : `${this.$store.state.webUrl.user.details}announcement/`
      this.$axios({
        url,
        method,
        data: {
          value: JSON.stringify(this.submitWordCloud),
          type: 3,
        },
        headers: {
          // "Content-Type": "multipart/form-data",
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          if (this.createFlag) this.createFlag = false
          this.$bvToast.toast(response.data.result, {
            title: "提交结果",
            autoHideDelay: 5000,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  props: {
    // avatarUrl: {
    //   type: String,
    //   default: require("../assets/Akkarin.png"),
    // },
  },
  watch: {
    uid (value) {
      this.getUserInfo()
    },
    currentTabIndex (value) {
      if (value == 1) this.getUserDetails()
    },
  },
}
</script>
<style scoped lang="scss">
.fill-t,
.fill-y,
.fill {
  margin-top: -20px;
}

.fill-b,
.fill-y,
.fill {
  margin-bottom: -20px;
}

.fill-l,
.fill-x,
.fill {
  margin-left: -20px;
}

.fill-r,
.fill-x,
.fill {
  margin-right: -20px;
}

p {
  margin-bottom: 0;
  font-size: 18px;
}
.position-center {
  position: absolute;
}

.t-center {
  text-align: center;
}
.t-left {
  text-align: left;
}

.br-0 {
  border-radius: 0;
}
.bl-0 {
  border-left: 0;
}
.bt-0 {
  border-top: 0;
}
.bb-0 {
  border-bottom: 0;
}

.row-input {
  background-color: unset;
}
.on-show {
  display: none;
}
.row-input:hover .on-show {
  display: block;
}

input:disabled {
  background-color: unset;
  font-weight: bold;
}
input::placeholder {
  color: gray;
}
input{
    outline-style: none ;
    border: 1px solid #ccc; 
    border-radius: 3px;
    padding: 6px;
    font-size: 14px;
    width: 100%;
    font-family: "Microsoft soft";
}
input:focus{
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
}

.fixed-right {
  position: absolute;
  right: 5px;
}

.btn-delete {
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
