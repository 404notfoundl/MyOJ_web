<!--
 * @Author: 
 * @Date: 2022-03-07 08:38:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-20 11:24:36
 * @Description: 请填写简介
-->
<template>
  <div>
    <b-row class="justify-content-center align-items-center" :style="`min-height:${avalHeight}px;`">
      <b-col lg="7">
        <b-card :style="`min-height:${avalHeight * 0.8}px;`" class="position-relative mt-1">
          <b-row class="h-100">
            <!-- 标题 -->
            <b-col class="h-25" cols="12">
              <p class="h3">
                <b>审核题解</b>
              </p>
              <hr />
            </b-col>
            <!-- 标签 -->
            <b-col cols="12">
              <b-row>
                <b-col cols="12" class="mt-1">
                  <b-row class="justify-content-between">
                    <b-col cols="2">
                      <p class="h6">题目编号</p>
                    </b-col>
                    <b-col cols="2">
                      <p class="h6">提交用户</p>
                    </b-col>
                    <b-col cols="2">
                      <p class="h6">提交时间</p>
                    </b-col>
                    <b-col cols="2">
                      <p class="h6">审核状态</p>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <hr />
            </b-col>
            <!-- 主体 -->
            <b-col cols="12" :style="`min-height:${avalHeight * 0.6}px;`">
              <b-row>
                <b-col v-for="(task, index) in solutionList" :key="index" cols="12" class="mt-1">
                  <!-- 预览部分 -->
                  <span v-b-toggle="`accordion-${index}`" class="d-block">
                    <b-row class="justify-content-between">
                      <b-col cols="2">
                        <router-link
                          :to="{ name: 'problemObj', params: { pid: task.pid } }"
                          class="text-reset"
                        >
                          {{ task.pid }}
                        </router-link>
                      </b-col>
                      <b-col cols="2">
                        <router-link
                          :to="{ name: 'usrInfo', params: { uid: task.uid } }"
                          class="text-reset"
                        >
                          {{ task.username }}
                        </router-link>
                      </b-col>
                      <b-col cols="2">
                        {{ task.submitDate }}
                      </b-col>
                      <b-col cols="2">
                        <p class="h6" v-if="Boolean(task.status - 1)">已审核</p>
                        <p class="h6" v-else>未审核</p>
                      </b-col>
                    </b-row>
                  </span>
                  <hr />
                  <!-- 主体部分 -->
                  <b-collapse :id="`accordion-${index}`" accordion="tasks" role="tabpanel">
                    <markdown
                      :mdPageHeight="avalHeight"
                      :Value.sync="task.value"
                      :showMode="showMode[task.status - 1]"
                      :showToolBar="!Boolean(task.status - 1)"
                      editMode="modify"
                      class="border-left border-right border-bottom"
                    >
                      <template slot="right-after">
                        <b-button
                          size="sm"
                          @click="submitSolution(0, index)"
                          title="通过"
                          class="op-icon fa my-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-check-lg"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"
                            />
                          </svg>
                        </b-button>
                        <b-button
                          size="sm"
                          @click="submitSolution(2, index)"
                          title="不通过"
                          class="op-icon fa my-0"
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
                              fill-rule="evenodd"
                              d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                            />
                          </svg>
                        </b-button>
                      </template>
                    </markdown>
                  </b-collapse>
                </b-col>
              </b-row>
            </b-col>
            <!-- 分页 -->
            <b-col cols="12" class="mt-3">
              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                align="center"
                @change="getSolutionList"
              >
              </b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import markdown from "@/components/MdDemo"
import "@/scripts/Date"
export default {
  components: {
    markdown,
  },
  computed: {
    perPage: function () {
      return Math.floor((this.avalHeight * 0.6) / 30)
    },
  },
  created: function () {
    let info = this.getUserInfo()
    if (info) {
      if (!info.isAdmin) {
        this.$router.replace({ name: "newSolutions" })
      } else {
        this.getSolutionList()
      }
    } else {
      this.$router.replace({ name: "newSolutions" })
    }
  },
  data: function () {
    return {
      solutionList: [{ uid: 0, pid: 999, username: "a", value: "b", submitDate: "1-23" }],
      rows: 5,
      currentPage: 1,
      showMode: ["edit", "preview"],
    }
  },
  methods: {
    getSolutionList: /*async*/ function (page = 1) {
      let info = this.getUserInfo()
      /*await*/ this.$axios({
        url: this.$store.state.webUrl.solution.check,
        params: {
          page: page,
          cols: this.perPage,
        },
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          this.rows = response.data[0].total
          this.solutionList = response.data.slice(1, response.data[0].total + 1)
          this.serliazer(this.solutionList)
        })
        .catch((err) => {
          console.log("failed", err)
        })
    },
    serliazer(data) {
      for (let d in data) {
        data[d].submitDate = new Date(data[d].submitDate).format("MM-dd HH:mm")
      }
    },
    submitSolution(state, index) {
      let info = this.userInfo
      let data = this.solutionList[index]
      data["status"] = state
      // debugger.
      if (!state) {
        // 通过
        this.$axios({
          method: "POST",
          url: `${this.$store.state.webUrl.solution.submit}`,
          data,
          headers: {
            authorization: `Bearer ${info.token}`,
          },
        })
          .then((response) => {
            console.log("created")

            this.$axios({
              method: "DELETE",
              url: `${this.$store.state.webUrl.solution.check}${data.pid}/`,
              data,
              headers: {
                authorization: `Bearer ${info.token}`,
              },
            })
              .then((response) => {
                console.log("delete")
                this.toast("成功")
                this.solutionList.splice(index, 1)
                // debugger
              })
              .catch((err) => {
                // debugger
                this.toast("失败")
                console.log("delete failed")
              })
          })
          .catch((err) => {
            this.toast("失败")
            console.log("create failed", err.response.data)
          })
      } else {
        // 打回
        this.$axios({
          method: "PUT",
          url: `${this.$store.state.webUrl.solution.check}${data["pid"]}/`,
          data,
          headers: {
            authorization: `Bearer ${info.token}`,
          },
        })
          .then((response) => {
            console.log("success")
            this.toast(response.data.result)
            // debugger
          })
          .catch((err) => {
            console.log("failed")
            this.toast(err.data.result)
          })
      }
    },
  },
  name: "checkSolution",
}
</script>

<style scoped>
hr {
  margin-top: 0;
  margin-bottom: 0;
}

.fix-bottom {
  position: absolute;
  bottom: 2%;
}
</style>
