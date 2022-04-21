<!--
 * @Author: 
 * @Date: 2022-01-31 09:48:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-20 10:23:26
 * @Description: 请填写简介
-->
<template>
  <div class="container-lg">
    <b-row v-if="isSolutionMode">
      <b-col>
        <b-card>
          <p class="h1 text-left">
            <b>{{ $route.params.pid }}.题解</b>
          </p>
          <hr />
        </b-card>
      </b-col>
    </b-row>
    <b-card class="mt-2 border" v-for="(solution, index) in solutions" :key="index">
      <b-row>
        <b-col cols="2">
          <div class="d-inline-block">
            <b-link
              :to="{ name: 'usrInfo', params: { uid: solution.uid } }"
              class="text-decoration-none"
            >
              <p class="text-left px-2 h5">
                <b>{{ solution.username }}</b>
              </p>
            </b-link>
          </div>
        </b-col>
      </b-row>
      <solution :info="solution" :showToolBar="false"> </solution>
      <!-- <p>{{ solution }}</p> -->
    </b-card>
  </div>
</template>

<script>
import solution from "@/components/solution"
export default {
  name: "SolutionPage",
  components: {
    solution,
  },
  computed: {
    isSolutionMode() {
      return this.showMode === "solution"
    },
  },
  created() {
    switch (this.$route.name) {
      case "solution":
        this.getSolutions()
        break
      case "newSolutions":
        this.getNews()
        break
    }
  },
  data: function () {
    return {
      solutions: [
        {
          uid: 0,
          username: "",
          value: "",
        },
      ],
    }
  },
  methods: {
    getSolutions() {
      let params = {
        pid: this.$route.params.pid,
      }
      this.$axios({
        method: "GET",
        url: `${this.$store.state.webUrl.solution.preview}`,
        params,
      })
        .then((response) => {
          console.log("success")
          this.solutions = response.data
        })
        .catch((err) => {
          console.log("failed")
          let data = [
            {
              uid: null,
              value: "# 现无题解",
              username: "",
            },
          ]
          this.solutions = data
        })
    },
    getNews() {
      this.solutions = [
        {
          uid: 0,
          username: "abc",
          value: "# 首页的测试1",
        },
        {
          uid: 1,
          username: "123",
          value: "# 首页的测试2",
        },
      ]
    },
  },
  props: {
    showMode: {
      type: String,
      default: "main",
    },
  },
}
</script>
<style lang="scss" scoped>
hr {
  margin-top: 0;
  margin-bottom: 0;
}
p {
  margin-bottom: 0;
}
.bg-white {
  background-color: white;
}
</style>
