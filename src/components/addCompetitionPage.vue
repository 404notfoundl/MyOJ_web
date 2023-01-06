<!--
 * @Author: 
 * @Date: 2022-04-24 20:50:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-06 17:01:42
 * @Description: 创建竞赛页面
-->
<template>
  <b-row class="justify-content-center mt-3">
    <b-col lg="7">
      <b-card no-body card>
        <b-form @submit.prevent="submitCompetition">
          <b-tabs card lazy v-model="tabInfo.current">
            <template v-slot:tabs-end>
              <b-nav-item @click.prevent="addTab" href="#"><b>+</b></b-nav-item>
            </template>
            <b-tab active title="竞赛描述">
              <b-row class="h-25">
                <b-col class="border-bottom">
                  <!-- 标题组 -->
                  <b-form-group class="float-left px-2 py-1">
                    <div class="d-inline-block">
                      <h1>名称：</h1>
                    </div>
                    <div class="d-inline-block">
                      <b-form-input
                        v-model="competitionDetail.title"
                        placeholder="请输入本次竞赛名称"
                      ></b-form-input>
                    </div>

                    <div class="d-inline-block">
                      <date-picker
                        placeholder="选择开始时间"
                        v-model="competitionDetail.startDate"
                        type="datetime"
                        :disabled-date="disabledStartDate"
                        :disabled-time="disabledStartTime"
                        class="mb-1"
                      ></date-picker>
                      <br />
                      <date-picker
                        placeholder="选择结束时间"
                        type="datetime"
                        v-model="competitionDetail.endDate"
                        :disabled-date="disabledEndDate"
                        :disabled-time="disabledEndTime"
                      ></date-picker>
                    </div>
                    <div class="d-inline-block w-25">
                      <p class="h6 float-left mb-0"><b>罚时(分钟):</b></p>
                      <b-form-input
                        class="w-75"
                        v-model="competitionDetail.timeDeltaLength"
                        placeholder="请输入比赛的罚时"
                      >
                      </b-form-input>
                    </div>
                  </b-form-group>
                  <b-button type="submit" size="lg" class="right-top mt-1 br-0" variant="outline-secondary"
                    >提交</b-button
                  >
                </b-col>
              </b-row>
              <b-row class="h-75">
                <b-col class="px-0">
                  <b-form-group>
                    <markdown
                      :mdPageHeight="avalHeight * 0.6 * 0.9"
                      :Value.sync="competitionDetail.description"
                    ></markdown>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="`问题${index + 1}`" v-for="(item, index) in problem_list" :key="item.id">
              <!-- :submit.sync="item.form_data" -->
              <edit-page
                submitTitle="保存"
                :heightRate="0.9"
                :value.sync="item.data"
                :oldProblem="item.data"
              ></edit-page>
            </b-tab>
          </b-tabs>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import markdown from "@/components/MdDemo"
import DatePicker from "vue2-datepicker"
import "vue2-datepicker/index.css"
import "vue2-datepicker/locale/zh-cn"
import { nanoid } from "nanoid"
import editPage from "./editProblemPage.vue"

export default {
  name: "appendCompetition",
  components: {
    "edit-page": editPage,
    markdown,
    DatePicker,
  },
  data() {
    return {
      competitionDetail: {
        title: "",
        startDate: null,
        endDate: null,
        timeDeltaLength: 20,
        description: "",
      },
      tabInfo: {
        current: 0,
        tab_count: 1,
      },
      problem_list: [],
    }
  },
  methods: {
    addTab() {
      this.tabInfo.tab_count++
      this.problem_list.push({
        id: nanoid(),
        data: {
          info: {
            limits: [{ timeLimit: "", memoryLimit: "" }],
          },
          title: "",
          label: "",
          difficulty: "",
          value: "",
        },
        form_data: {},
      })
    },
    dateFormatter(date) {
      let now = new Date(date)
      if (now == "Invalid Date") return date
      else return now.format("yyyy-MM-dd HH:mm:SS")
    },
    serializer() {
      let formData = new FormData()
      formData.append("submitter_id", this.userInfo.uid)
      formData.append("submitter", this.userInfo.username)
      for (let key in this.competitionDetail) {
        let data = this.competitionDetail[key]
        if (key == "startDate" || key == "endDate") data = this.dateFormatter(data)
        formData.append(key, data)
      }
      for (let cnt in this.problem_list) {
        let problem = this.problem_list[cnt].data
        let prob_str = JSON.stringify(problem)
        formData.append(`problem[${cnt}]`, prob_str)
        for (let k in problem.inputFiles) {
          formData.append(`problem[${cnt}][input]`, problem.inputFiles[k])
        }
        for (let k in problem.outputFiles) {
          formData.append(`problem[${cnt}][output]`, problem.outputFiles[k])
        }
        formData.append("problemCount", this.problem_list.length)
      }
      // debugger
      return formData
    },
    submitCompetition() {
      console.log("active")
      let method = "POST"
      let url = `${this.$store.state.webUrl.competition.self}/`
      // let data = this.serializer()
      let info = this.userInfo
      let data = this.serializer()
      this.$axios({
        url,
        method,
        formData: data,
        transformRequest: [
          function () {
            return data
          },
        ],
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          // debugger
          this.toast(response.data.result)
          // this.$router.replace({ name: "probLib" })
        })
        .catch((err) => {
          // debugger
          this.toast(err.data.result)
        })
    },
    disabledStartDate(date, current) {
      // console.log("start")
      let today = new Date()
      today.setDate(today.getDate() - 1)
      let compare = this.competitionDetail.endDate
      date = new Date(date)
      if (compare != null) {
        compare.setDate(compare.getDate())
        if (date > compare) {
          return true
        }
      }
      if (date < today) return true
      return false
    },
    disabledEndDate(date, current) {
      let today = new Date()
      today.setDate(today.getDate() - 1)
      let compare = this.competitionDetail.startDate
      date = new Date(date)
      if (compare != null) {
        compare = new Date(compare)
        compare.setDate(compare.getDate() - 1)
        // compare.setDate(compare.getDate())
        if (date < compare) return true
      }
      if (date < today) return true
      return false
    },
    disabledStartTime(date) {
      if (this.competitionDetail.endDate != null) {
        let end = new Date(this.competitionDetail.endDate)
        let select = date
        if (select >= end) return true
      }
      let now = new Date()
      if (now > date) return true
      return false
    },
    disabledEndTime(date) {
      if (this.competitionDetail.startDate != null) {
        let start = new Date(this.competitionDetail.startDate)
        let select = date
        if (select <= start) return true
      }
      let now = new Date()
      if (now > date) return true
      return false
    },
  },
}
</script>

<style scope>
.right-top {
  position: absolute;
  right: 2%;
  top: 2%;
}

input[name='date']{
  border-radius: 0;
}
</style>
