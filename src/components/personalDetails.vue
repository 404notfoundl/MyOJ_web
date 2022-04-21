<template>
  <div :style="'height:' + ojPageHeight + 'px'" class="w-100" :key="$route.params.uid">
    <!-- 上半部分 -->
    <div class="row h-25 w-100 justify-content-center pt-1 z-2">
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
          <div class="row h-100 align-items-end z-0">
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
            <!-- <div class="col-5 h-50"></div>
            <div class="col-3 h-auto"></div> -->
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
              <div class="row h-100">
                <div class="col-6">
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
                <b-col cols="2" v-for="(item, index) in userAcs" :key="index">
                  <b-link :to="{ name: 'problemObj', params: { pid: item.name } }">{{
                    item.name
                  }}</b-link>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="修改个人信息" v-if="isSelf">
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
                    <b-col cols="4" style="text-align: left">
                      <b-button type="submit" variant="outline-primary">提交</b-button>
                    </b-col>
                  </b-row>
                </b-form-group>
              </b-form>
            </b-tab>
            <!-- 通过的题目数 -->
            <b-tab title="禁用" disabled><p>I'm a disabled tab!</p></b-tab>
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
    isSelf() {
      return this.$route.params.uid == this.userInfo.uid
    },
    uid() {
      return this.$route.params.uid
    },
  },
  created() {
    // TODO 暂未完成
    let wordCloudObj = this.getLocalJson("usrWordCloud")
    if (wordCloudObj == null) {
      wordCloudObj = {}
      wordCloudObj["words"] = this.getRows()
      wordCloudObj["date"] = new Date().format("yyyy-MM-dd")
      this.setLocalJson("usrWordCloud", wordCloudObj)
    } else {
      if (new Date().format("yyyy-MM-dd") !== wordCloudObj["date"]) {
        console.log("update words")
        wordCloudObj["words"] = this.getRows()
        wordCloudObj["date"] = new Date().format("yyyy-MM-dd")
        this.setLocalJson("usrWordCloud", wordCloudObj)
      } else {
        console.log("use local words")
      }
    }
    this.wordCloudChartData.rows = wordCloudObj.words
    this.getUserInfo()
  },
  data() {
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
    }
  },
  methods: {
    getRows() {
      return [
        {
          word: "visualMap",
          count: 22199,
        },
        {
          word: "continuous",
          count: 10288,
        },
        {
          word: "contoller",
          count: 620,
        },
        {
          word: "series",
          count: 274470,
        },
        {
          word: "gauge",
          count: 12311,
        },
        {
          word: "detail",
          count: 1206,
        },
        {
          word: "piecewise",
          count: 4885,
        },
        {
          word: "textStyle",
          count: 32294,
        },
        {
          word: "markPoint",
          count: 18574,
        },
        {
          word: "pie",
          count: 38929,
        },
        {
          word: "roseType",
          count: 969,
        },
        {
          word: "label",
          count: 37517,
        },
        {
          word: "emphasis",
          count: 12053,
        },
        {
          word: "yAxis",
          count: 57299,
        },
        {
          word: "name",
          count: 15418,
        },
        {
          word: "type",
          count: 22905,
        },
        {
          word: "gridIndex",
          count: 5146,
        },
        {
          word: "normal",
          count: 49487,
        },
        {
          word: "itemStyle",
          count: 33837,
        },
        {
          word: "min",
          count: 4500,
        },
        {
          word: "silent",
          count: 5744,
        },
        {
          word: "animation",
          count: 4840,
        },
        {
          word: "offsetCenter",
          count: 232,
        },
        {
          word: "inverse",
          count: 3706,
        },
        {
          word: "borderColor",
          count: 4812,
        },
        {
          word: "markLine",
          count: 16578,
        },
        {
          word: "line",
          count: 76970,
        },
        {
          word: "radiusAxis",
          count: 6704,
        },
        {
          word: "radar",
          count: 15964,
        },
        {
          word: "data",
          count: 60679,
        },
        {
          word: "dataZoom",
          count: 24347,
        },
        {
          word: "tooltip",
          count: 43420,
        },
        {
          word: "toolbox",
          count: 25222,
        },
        {
          word: "geo",
          count: 16904,
        },
        {
          word: "parallelAxis",
          count: 4029,
        },
      ]
    },
    submitUserinfo() {
      let info = this.userInfo
      let data = {
        avatar_url: this.submitInfo.avatarUrl,
      }
      // debugger
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
    getUserInfo() {
      let info = this.userInfo
      this.$axios({
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
          console.log(err)
        })
    },
    getUserDetails() {
      // for (let a = 0; a < 20; a++) {
      //   this.userAcs[a] = { name: a + 1000 }
      // }
      // return
      let info = this.userInfo
      this.$axios({
        url: `${this.$store.state.webUrl.user.details}`,
        method: "GET",
        params: {
          uid: this.uid,
        },
        headers: {
          // "Content-Type": "multipart/form-data",
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          // console.log(response)
          this.userAcs = response.data
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
    uid(value) {
      this.getUserInfo()
    },
    currentTabIndex(value) {
      if (value == 1) this.getUserDetails()
    },
  },
}
</script>
<style scoped>
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
</style>
