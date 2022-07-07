<!--
 * @Author: 
 * @Date: 2022-04-24 20:42:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-01 08:50:30
 * @Description: 暂不修改，待后端完成后调用url
-->
<template>
  <div class="row justify-content-center py-3">
    <div class="col-lg-7">
      <b-card no-body class="h-auto">
        <b-tabs card lazy v-model="tabsIndex">
          <!-- 头部 -->
          <template v-slot:tabs-start>
            <!-- 返回上一页 -->
            <b-nav-item @click.prevent="back"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                /></svg
            ></b-nav-item>
          </template>
          <!-- 尾部 -->
          <template v-slot:tabs-end>
            <b-nav>
              <!-- 修改题目 -->
              <!-- TODO pid待修改 -->
              <b-nav-item
                title="修改此题"
                @click="gotoModify({ pid: problemObj.pid })"
                v-if="isAdmin"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </b-nav-item>
              <!-- 展开详情 -->
              <b-nav-item
                class="d-hidden-lt-lg"
                v-b-toggle.probDetailsPanel
                title="展开详情"
                v-show="!tabsIndex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-chevron-double-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </b-nav-item>
            </b-nav>
          </template>
          <b-tab title="问题描述" active>
            <!-- 标题 -->
            <b-skeleton-wrapper :loading="loading">
              <template #loading>
                <b-skeleton
                  v-for="(item, index) in Math.ceil(Math.random() * 40)"
                  :width="Math.ceil(Math.random() * 70) + '%'"
                  :key="index"
                ></b-skeleton>
              </template>
              <b-row class="justify-content-center fill-x">
                <b-col>
                  <div class="d-inline-block">
                    <h1>
                      <b>{{ problemObj.title }}</b>
                    </h1>
                  </div>
                  <div class="d-inline-block">
                    <p class="font-weight-light">难度:{{ problemObj.difficulty }}</p>
                  </div>
                  <hr />
                </b-col>
              </b-row>
              <b-row class="justify-content-left fill-x fill-b flex-row-reverse">
                <b-col class="">
                  <!-- 题目详情的折叠区域 -->
                  <b-collapse visible id="probDetailsPanel" class="">
                    <b-row>
                      <!-- 时空限制及通过、提交数 -->
                      <b-col>
                        <!-- 时空限制 -->
                        <b-table
                          :items="problemObj.info.limits"
                          :fields="problemObj.info.limitsLabel"
                          borderless
                          fixed
                          small
                          class="mb-1"
                        >
                        </b-table>
                        <!-- 通过，提交数 -->
                        <b-table
                          :items="problemObj.info.num"
                          :fields="problemObj.info.label"
                          borderless
                          fixed
                          small
                          class="border-bottom"
                        >
                        </b-table>
                      </b-col>
                    </b-row>
                    <!-- 标签 -->
                    <b-row align-h="center">
                      <b-col cols="4" class="px-0">
                        <b-button
                          variant="outline-secondary"
                          squared
                          size="sm"
                          class="border-0 px-0 py-0"
                          v-b-toggle.problemLabel
                          :pressed="false"
                        >
                          <p class="h6 d-inline">标签</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-chevron-double-down"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                            />
                          </svg>
                        </b-button>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col class="px-0">
                        <b-collapse id="problemLabel" class="mt-2">
                          <b-badge
                            class="ml-1"
                            pill
                            variant="light"
                            v-for="(item, index) in splitLabel()"
                            :key="index"
                          >
                            {{ item }}
                          </b-badge>
                        </b-collapse>
                      </b-col>
                    </b-row>
                    <hr />
                    <b-row class="justify-content-end">
                      <b-col cols="4">
                        <b-link
                          :to="{ name: 'solution', params: $route.params.pid }"
                          class="text-decoration-none text-muted d-inline-block"
                          >题解</b-link
                        >
                      </b-col>
                    </b-row>
                  </b-collapse>
                </b-col>
                <b-col class="px-0 border-right" lg="9">
                  <markdown
                    :mdPageHeight="avalHeight"
                    :Value="problemObj.value"
                    showMode="preview"
                    :showToolBar="false"
                  >
                  </markdown>
                </b-col>
              </b-row>
            </b-skeleton-wrapper>
          </b-tab>
          <b-tab title="提交答案">
            <b-row class="justify-content-center fill">
              <b-col lg="12">
                <code-editor
                  :showIOArea="false"
                  :avalHeightRate="0.8"
                  @submit="submitCode"
                ></code-editor>
              </b-col>
            </b-row>
          </b-tab>
          <!-- 未认证则没有 -->
          <div v-if="isAuthed">
            <b-tab title="提交记录">
              <b-row class="fill">
                <b-col lg="12">
                  <b-row>
                    <b-col v-if="tasksInfo.length == 0 && !loading">
                      <p class="h5 pt-2">现无记录</p>
                    </b-col>
                    <b-col
                      cols="12"
                      class="mb-2 mt-2 justify-content-start"
                      v-for="(task, index) in tasksInfo"
                      :key="index"
                      v-else
                    >
                      <!-- 预览部分 -->
                      <span v-b-toggle="`accordion-${index}`" class="d-block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-chevron-down"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                        <p class="mb-0 d-inline-block">{{ task.submitDate }}</p>
                        <p
                          :class="`mb-0 d-inline-block text-${
                            task.status === 'AC' ? 'success' : 'danger'
                          }`"
                        >
                          {{ task.preview }}
                        </p>
                      </span>
                      <hr />
                      <!-- 主体部分 -->
                      <b-collapse :id="`accordion-${index}`" accordion="tasks" role="tabpanel">
                        <b-card no-body class="border-top-0 w-100">
                          <b-card-body>
                            <b-row>
                              <!-- 过题状态 -->
                              <b-col
                                :style="`max-height:${avalHeight * 0.6}px;`"
                                class="status-panel"
                              >
                                <hr />
                                <!-- 折叠详情 -->
                                <span v-b-toggle.acRate>
                                  <b-card-text class="mt-2 d-inline-block"
                                    >通过:{{ task.acNum }}/{{ task.total }}</b-card-text
                                  >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-chevron-down d-hidden-lt-lg"
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                    />
                                  </svg>
                                </span>
                                <b-collapse id="acRate" visible>
                                  <b-button
                                    v-for="(stat, index) in task.status"
                                    :class="`ml-2 mb-2 btn-${stat} m-size-1`"
                                    :key="index"
                                    :title="task.details[index]"
                                    squared
                                    >#{{ index }}<br />{{ statusMap[stat] }}</b-button
                                  >
                                </b-collapse>
                                <hr />
                              </b-col>
                              <!-- 提交代码 -->
                              <b-col lg="9">
                                <code-editor
                                  :showIOArea="false"
                                  :avalHeightRate="0.6"
                                  :isEditMode="false"
                                  :code="task.code"
                                  :lang="task.lang"
                                ></code-editor>
                              </b-col>
                            </b-row>
                          </b-card-body>
                        </b-card>
                      </b-collapse>
                    </b-col>
                    <!-- 加载中。。。 -->
                    <b-col v-show="loading && Boolean(nextTaskPage)" class="py-5">
                      <b-spinner label="加载中。。。" variant="primary"></b-spinner>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="提交题解">
              <b-row class="justify-content-center fill">
                <markdown
                  :mdPageHeight="avalHeight"
                  :Value.sync="solution"
                  showMode="edit"
                  :showToolBar="true"
                >
                  <template slot="right-after">
                    <b-button
                      size="sm"
                      @click="submitSolution"
                      title="提交"
                      class="op-icon fa my-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-check2-square"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"
                        />
                        <path
                          d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"
                        />
                      </svg>
                    </b-button>
                  </template>
                </markdown>
                <!-- <b-col lg="12">
              </b-col> -->
              </b-row>
            </b-tab>
          </div>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>
<script>
import markdown from "@/components/MdDemo"
import codeEditor from "@/components/CodeEditor"

export default {
  name: "Problem",
  components: {
    markdown,
    "code-editor": codeEditor,
  },
  computed: {
    cols() {
      return Math.floor(this.$store.state.avaliableHeight / 50)
    },
    isBottom() {
      return this.$store.state.isBottom
    },
  },
  created: function () {
    this.getProbDetails()
    // this.getSubmitedSolution()
    // this.getTasks()
  },
  data() {
    this.statusMap = {
      a: "AC",
      c: "CE",
      m: "MLE",
      t: "TLE",
      r: "RE",
      u: "UKE",
      w: "WA",
    }
    return {
      problemObj: {
        info: {
          num: [{ acceptNum: 0, submitNum: 0 }],
          label: [
            { key: "acceptNum", label: "通过数" },
            { key: "submitNum", label: "提交数" },
          ],
          limits: [{ timeLimit: "1000ms", memoryLimit: "128MB" }],
          limitsLabel: [
            { key: "timeLimit", label: "时间限制" },
            { key: "memoryLimit", label: "空间限制" },
          ],
        },
        title: "",
        label: "",
        difficulty: "",
        value: "",
      },
      tabsIndex: 0,
      tabsMap: [this.nullFunc, this.nullFunc, this.getTasks, this.getSubmitedSolution],
      solution: null,
      tasksInfo: [],
      nextTaskPage: "",
      hasSubmited: false,
      loading: false,
    }
  },
  methods: {
    nullFunc() {},
    gotoModify(props) {
      // debugger
      props["oldProblem"] = this.problemObj
      this.$emit("go-to", "modifyProblem", props)
    },
    back() {
      this.$router.back()
    },
    serializer(data) {
      let value = {
        info: {
          num: [{ acceptNum: data.acceptNum, submitNum: data.submitNum }],
          label: [
            { key: "acceptNum", label: "通过数" },
            { key: "submitNum", label: "提交数" },
          ],
          limits: [{ timeLimit: data.timeLimit, memoryLimit: data.memoryLimit }],
          limitsLabel: [
            { key: "timeLimit", label: "时间限制" },
            { key: "memoryLimit", label: "空间限制" },
          ],
        },
        title: data.title,
        label: data.label,
        difficulty: data.difficulty,
        value: data.value,
        pid: data.pid,
      }
      return value
    },
    getProbDetails: async function () {
      let url = `${this.$store.state.webUrl.problems}${this.$route.params.pid}/`
      this.loading = true
      // debugger
      await this.$axios({
        url,
        method: "GET",
      })
        .then((response) => {
          this.problemObj = this.serializer(response.data)
        })
        .catch((err) => {
          console.log(err)
          this.$router.push({ name: "404" })
          return {}
        })
        .finally(() => {
          this.loading = false
        })
    },
    getTasks() {
      this.loading = true
      let info = this.userInfo
      // TODO pid待修改
      let params = {
        uid: info.uid, //有待获取uid
        pid: this.problemObj.pid === undefined ? -1 : Number.parseInt(this.problemObj.pid), //-1表示是在线编辑器
        cols: this.cols,
      }
      //编辑器的输入数据
      let url =
        this.nextTaskPage === "" ? `${this.$store.state.webUrl.task.preview}` : this.nextTaskPage
      if (url === null) return
      let method = "GET"
      //之后是提交此记录
      this.$axios({
        url,
        method,
        params,
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          this.nextTaskPage = response.data.next
          let tasks = response.data.results
          for (let a = 0; a < tasks.length; a++) {
            tasks[a].total = tasks[a].status.length
            let acNum = 0
            for (let b in tasks[a].status) {
              if (tasks[a].status[b] === "a") acNum++
            }
            tasks[a].acNum = acNum
            tasks[a].details = tasks[a].details.split("#")
            tasks[a].accepted = acNum == tasks[a].status.length
            tasks[a].preview = tasks[a].accepted ? "AC" : "WA"
            tasks[a].submitDate = new Date(tasks[a].submitDate).format("yyyy-MM-dd HH:mm:SS")
          }
          // debugger
          // console.log(tasks)
          this.tasksInfo = this.tasksInfo.concat(tasks)
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          // debugger
          console.log(err)
        })
    },
    getSubmitedSolution() {
      let info = this.userInfo
      if (!info) return
      let params = {
        pid: this.$route.params.pid,
        uid: info.uid,
      }
      this.$axios({
        method: "GET",
        url: `${this.$store.state.webUrl.solution.check}${params.pid}/`,
        params,
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          if (response.data.result === 404) this.hasSubmited = false
          else this.hasSubmited = true
          this.solution = response.data.value
        })
        .catch((err) => {
          this.hasSubmited = false
        })
    },
    submitSolution() {
      if (this.solution === "") return
      let info = this.userInfo
      let method = this.hasSubmited ? "PUT" : "POST"
      let data = {
        value: this.solution,
        pid: this.$route.params.pid,
        uid: info.uid,
        username: info.username,
        status: 1,
      }
      let url = this.hasSubmited
        ? `${this.$store.state.webUrl.solution.check}${data.pid}/`
        : this.$store.state.webUrl.solution.check

      this.$axios({
        method,
        url,
        data,
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          this.$bvToast.toast(response.data.result, {
            title: "提交结果",
            autoHideDelay: 5000,
          })
          console.log("success")
        })
        .catch((err) => {
          this.$bvToast.toast(err, {
            title: "提交结果",
            autoHideDelay: 5000,
          })
          console.log("failed")
        })
    },
    submitCode(data) {
      let uid = this.userInfo.uid
      let pid = this.$route.params.pid === undefined ? -1 : Number.parseInt(this.$route.params.pid)
      data.uid = uid
      data.pid = pid
      let url = `${this.$store.state.webUrl.task.submit}`
      let method = "POST"
      //之后是提交此记录
      this.$axios({
        url,
        method,
        data,
        headers: {
          authorization: `Bearer ${this.userInfo.token}`,
        },
      })
        .then((response) => {
          this.toast(response.data.result)
          // console.log(response)
        })
        .catch((err) => {
          // debugger
          this.toast(err)
          // console.log(err)
        })
      // console.log(data)
    },
    splitLabel() {
      if (this.problemObj.label === undefined) return null
      return this.problemObj.label.split(",")
    },
  },
  mounted() {},
  watch: {
    tabsIndex(current, previous) {
      this.tabsMap[current]()
      this.nextTaskPage = ""
      this.tasksInfo = []
    },
    isBottom(current, previous) {
      if (current && this.tabsIndex == 2) {
        this.getTasks()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
$status_colors: (
  //嫩绿
  a: #bddd22,
  //橘红
  w: #ff7500,
  //藏青
  t: #2e4e7e,
  //绀青
  m: #003371,
  //丹
  r: #ff4e20,
  //漆黑
  u: #161823
);

@each $key, $val in $status_colors {
  .btn-#{$key} {
    color: #f0fcff !important; //雪白
    background-color: $val !important;
    border-color: $val !important;
  }
}

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

.status-panel {
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #fff;
  }
  &:hover {
    &::-webkit-scrollbar-track-piece {
      /*鼠标移动上去再显示滚动条*/
      background-color: #fff;
      /* 滚动条的背景颜色 */
      border-radius: 6px;
      /* 滚动条的圆角宽度 */
    }
    &::-webkit-scrollbar-thumb {
      &:hover {
        background-color: #c0cecc;
      }
      &:vertical {
        background-color: #c0cedc;
        border-radius: 6px;
        outline: 2px solid #fff;
        outline-offset: -2px;
        border: 2px solid #fff;
      }
    }
  }
}

.m-size-1 {
  min-width: 80px;
  min-height: 80px;
  font-size: 1.25rem;
  line-height: 1.5;
}

hr {
  margin-top: 0;
  margin-bottom: 0;
}

.font-md {
  font-size: 16px;
}

.border-bottom {
  padding: 0;
  border-bottom: 1px solid #dbdbdb;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
}
</style>
