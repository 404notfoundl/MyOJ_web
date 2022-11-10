<!--
 * @Author: 
 * @Date: 2022-01-31 09:48:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-15 14:55:37
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
    <b-card
      class="mt-2 border"
      v-for="(solution, index) in solutions"
      :key="solution.pid"
    >
      <b-row>
        <b-col cols="2">
          <div class="d-inline-block">
            <b-link
              :to="{ name: 'usrInfo', params: { uid: solution.uid } }"
              class="text-decoration-none d-inline-block"
            >
              <p class="text-left h5">
                <b>{{ solution.username }}</b>
              </p>
            </b-link>
            <b-button
              variant="outline-secondary"
              class="b-0 mb-1"
              size="sm"
              title="复制"
              @click="copyValue(solution.value)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-clipboard-check"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                />
                <path
                  d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
                />
                <path
                  d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
                />
              </svg>
            </b-button>
          </div>
        </b-col>
      </b-row>
      <solution :info="solution" :showToolBar="false" :loading="loading">
      </solution>
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
    isSolutionMode () {
      return this.showMode === "solution"
    },
    pageName () {
      return this.$route.name
    },
  },
  created () {
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
    getInfo () {
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
    getSolutions () {
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
        .catch((err) => { })
        .finally(() => {
          this.loading = false
        })
    },
    getNews () {
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
    copyValue (val) {
      this.$copyText(val).then((e) => {
        this.toast("已复制")
      }, (e) => {
        this.toast("复制失败")
        console.log(e)
      })
    }
  },
  props: {
    showMode: {
      type: String,
      default: "main",
    },
  },
  watch: {
    pageName () {
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
.b-0 {
  border: 0;
}
</style>
