<!--
 * @Author: 
 * @Date: 2022-04-22 13:36:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-29 15:15:31
 * @Description: 请填写简介
-->
<template>
  <b-row class="justify-content-center mt-3">
    <b-col lg="7">
      <b-card no-body>
        <b-card-body>
          <!-- 标题部分 -->
          <b-row class="border-bottom">
            <b-col class="float-left">
              <p class="h1 d-inline-block">{{ this.competitionDetail.title }}</p>
              <p class="h6 d-inline-block">
                发起者:<b-link
                  :to="{ name: 'usrInfo', params: { uid: this.competitionDetail.submitter_id } }"
                  >{{ this.competitionDetail.submitter }}</b-link
                >
              </p>
            </b-col>
            <!-- 计时 -->
            <b-col class="position-relative">
              <div class="bottom">
                <!-- 不知为何不起作用，手动 -->
                <countdown
                  :end-time="competitionDetail.startDate"
                  class="d-inline-block"
                  v-if="today < competitionDetail.startDate"
                  @finish="startCountDown"
                >
                  <template v-slot:process="time">
                    <p class="h5">
                      {{
                        `距离开始还剩：${time.timeObj.d}天 ${time.timeObj.h}:${time.timeObj.m}:${time.timeObj.s}`
                      }}
                    </p>
                  </template>
                </countdown>
                <countdown
                  v-else
                  ref="countDown"
                  :startTime="competitionDetail.startDate"
                  :endTime="competitionDetail.endDate"
                  class="d-inline-block"
                >
                  <template v-slot:process="time">
                    <p class="h5">
                      {{ `距离结束还剩：${time.timeObj.h}:${time.timeObj.m}:${time.timeObj.s}` }}
                    </p>
                  </template>
                  <template v-slot:finish>
                    <p class="h5">已结束!</p>
                  </template>
                </countdown>
              </div>
            </b-col>
          </b-row>
          <!-- 内容 -->
          <b-row>
            <b-col>
              <b-tabs
                content-class="mt-3 border-left w-25"
                vertical
                lazy
                pills
                nav-class="mt-3"
                v-model="currentTabIndex"
              >
                <b-tab active title="详情">
                  <markdown
                    :mdPageHeight="avalHeight * 0.8"
                    :Value="competitionDetail.description"
                    showMode="preview"
                    :showToolBar="false"
                  ></markdown>
                </b-tab>
                <b-tab title="题目">
                  <b-table
                    @row-selected="rowSelected"
                    :fields="problemsLabel"
                    :items="getProblemList"
                    primary-key="pid"
                    selectable
                    select-mode="single"
                    striped
                    hover
                    small
                  ></b-table>
                </b-tab>
                <b-tab title="排行">
                  <b-table
                    small
                    :fields="rankLabel"
                    :items="getRankList"
                    striped
                    hover
                    responsive
                    fixed
                  >
                    <template #thead-top="data">
                      <b-tr>
                        <!-- <b-th colspan="2"><span class="sr-only">Name and ID</span></b-th> -->
                        <b-th variant="primary">提交人</b-th>
                        <b-th variant="secondary" :colspan="problemCount">题目</b-th>
                        <b-th variant="danger">总罚时</b-th>
                      </b-tr>
                    </template>
                    <template
                      v-for="cnt in problemCount"
                      :slot="`cell(${String.fromCharCode(65 + cnt - 1)})`"
                      slot-scope="data"
                    >
                      <span :key="cnt">
                        <p class="h6 my-0">
                          {{ data.item.acTimeList[cnt - 1]
                          }}{{
                            data.item.timeDeltaList[cnt - 1] == 0
                              ? null
                              : `(-${data.item.timeDeltaList[cnt - 1]})`
                          }}
                        </p>
                      </span>
                    </template>
                  </b-table>
                  <!-- <div v-for="(item, index) in rankLabel" :key="index">
                    {{ item }}
                  </div> -->
                </b-tab>
              </b-tabs>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import markdown from "./MdDemo.vue"
export default {
  name: "competitionPage",
  components: {
    markdown,
  },
  created: async function () {
    await this.getCompetitionInfo()
  },
  data() {
    return {
      today: new Date().getTime(),
      currentTabIndex: 0,
      competitionDetail: {
        title: "测试比赛",
        description: "# 测试描述",
        submitter: "admin",
        submitter_id: 1,
        startDate: null,
        endDate: null,
      },
      problemCount: 1,
      problemsLabel: [
        { key: "pid", label: "#" },
        { key: "title", label: "名称" },
        { key: "acceptNum", label: "通过数" },
        { key: "submitNum", label: "提交数" },
      ],
      problemsList: [
        { pid: 0, acceptNum: 0, submitNum: 0, title: "1" },
        { pid: 1, acceptNum: 0, submitNum: 0, title: "2" },
        { pid: 2, acceptNum: 0, submitNum: 0, title: "3" },
        { pid: 3, acceptNum: 0, submitNum: 0, title: "4" },
        { pid: 4, acceptNum: 0, submitNum: 0, title: "5" },
      ],
      rankLabel: [
        {
          key: "submitter",
          label: "",
          isRowHeader: true,
          stickyColumn: true,
          variant: "primary",
        },
        { key: "totalTime", label: "" },
      ],
      rankList: [
        {
          submitter_id: 0,
          submitter: "0",
          acTimeList: "1,2,3,4,5,6",
          timeDeltaList: "0,1,1,2,2,0",
          totalTime: "5",
        },
        {
          submitter_id: 1,
          submitter: "1",
          acTimeList: "a,,,,,",
          timeDeltaList: "0,1,1,2,2,0",
          totalTime: "5",
        },
        {
          submitter_id: 2,
          submitter: "2",
          acTimeList: "b,,,,,",
          timeDeltaList: "0,1,1,2,2,0",
          totalTime: "5",
        },
        {
          submitter_id: 3,
          submitter: "3",
          acTimeList: "c,,,,,",
          timeDeltaList: "0,1,1,2,2,0",
          totalTime: "5",
        },
        {
          submitter_id: 4,
          submitter: "4",
          acTimeList: "d,,,,,",
          timeDeltaList: "0,1,1,2,2,0",
          totalTime: "5",
        },
        {
          submitter_id: 5,
          submitter: "5",
          acTimeList: "e,,,,,",
          timeDeltaList: "0,1,1,2,2,0",
          totalTime: "5",
        },
      ],
    }
  },
  methods: {
    getCompetitionInfo: async function () {
      await this.$axios({
        url: `${this.$store.state.webUrl.competition.self}/${this.$route.params.cid}/`,
        // params: {
        //   page: this.currentPage,
        //   cols: this.pageCols
        // }
      })
        .then((response) => {
          this.competitionDetail = response.data
          this.competitionDetail.startDate = new Date(response.data.startDate).getTime()
          this.competitionDetail.endDate = new Date(response.data.endDate).getTime()
          // this.competitionDetail.startDate = "2022-04-28 11:30:00"
          // this.competitionDetail.endDate = "2022-04-28 11:50:00"
          // this.$nextTick(() => {
          //   this.$refs.countDown.startCountdown(true)
          // })
        })
        .catch((error) => {
          // debugger
          console.log(error)
        })
    },
    getProblemList(ctx, callback) {
      // let pk = `${this.$route.params.cid}_${this.route.params.pid}`
      this.$axios({
        url: `${this.$store.state.webUrl.competition.problem}`,
        method: "GET",
        params: {
          competition_id: this.$route.params.cid,
        },
      })
        .then((response) => {
          this.problemsList = response.data
          callback(this.problemsList)
        })
        .catch((error) => {
          callback([])
        })
      // callback(this.problemsList)
    },
    getRankList(ctx, callback) {
      // TODO 待完善
      let list = this.rankList
      if (typeof list[0].acTimeList != "object")
        for (let cnt in list) {
          list[cnt].acTimeList = list[cnt].acTimeList.split(",")
          list[cnt].timeDeltaList = list[cnt].timeDeltaList.split(",")
        }
      this.problemCount = list[0].acTimeList.length
      let dcnt = 1
      for (let cnt = 0; cnt < this.problemCount; cnt++) {
        this.rankLabel.splice(dcnt + cnt, 0, {
          key: String.fromCharCode(65 + cnt),
          label: String.fromCharCode(65 + cnt),
        })
      }
      callback(list)
    },
    rowSelected(item) {
      let params = {
        cid: this.$route.params.cid,
        pid: item[0].pid,
      }
      this.$emit("go-to", "competitionProblem", params)
    },
    startCountDown() {
      this.today = new Date().getTime()
    },
  },
}
</script>

<style>
.bottom {
  position: absolute;
  right: 5%;
  bottom: 0;
}
</style>
