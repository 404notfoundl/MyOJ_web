<!--
 * @Author: 
 * @Date: 2022-01-31 09:48:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-15 09:38:16
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
    <b-card class="mt-2 border" v-for="(solution, index) in solutions" :key="solution.pid">
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
      <solution :info="solution" :showToolBar="false" :loading="loading"> </solution>
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
    pageName() {
      return this.$route.name
    },
  },
  created() {
    this.getInfo()
  },
  data: function () {
    return {
      solutions: [
        {
          pid: 0,
          uid: -1,
          username: "null",
          value: "# 暂无题解",
        },
      ],
      loading: false,
    }
  },
  methods: {
    getInfo() {
      this.loading = true
      switch (this.pageName) {
        case "solution":
          this.getSolutions()
          break
        case "newSolutions":
          this.getNews()
          break
      }
    },
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
          if (response.data.length > 0) this.solutions = response.data
        })
        .catch((err) => {})
        .finally(() => {
          this.loading = false
        })
    },
    getNews() {
      this.$axios({
        method: "GET",
        url: `${this.$store.state.webUrl.site_config.announcement}`,
      })
        .then((response) => {
          this.solutions = [
            {
              value: response.data.value,
              username: response.data.backup,
              uid: response.data.backup_2,
            },
          ]
        })
        .catch((err) => {
          this.solutions = [
            {
              value: "暂无",
              username: "admin",
              uid: 1,
            },
          ]
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  props: {
    showMode: {
      type: String,
      default: "main",
    },
  },
  watch: {
    pageName() {
      this.getInfo()
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
