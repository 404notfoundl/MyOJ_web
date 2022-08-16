<template>
  <div id="app" class="body-page selector-for-some-widget h-auto">
    <div class="h-auto fixed-top">
      <Navbar ref="navbar" @go-to="goToPage"></Navbar>
    </div>
    <div
      class="container-fluid"
      v-if="true"
      :style="`min-height:${mainHeight * 0.9}px;padding-top:${navbarHeight}px;`"
    >
      <!-- <problem v-if="true"></problem> -->
      <transition name="fade" mode="out-in">
        <router-view @go-to="goToPage" @submit="submitUserCode" :output="output"></router-view>
      </transition>
    </div>

    <!-- 返回顶部 -->
    <div class="fixed-right-bottom z-0" v-show="!this.$store.state.isTop">
      <b-button squared variant="outline-info" @click="scrollToTop" size="lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          class="bi bi-arrow-up"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
          />
        </svg>
      </b-button>
    </div>
    <footer v-show="editorPage" v-if="false">
      <p class="h6 pb-4">
        如遇问题请联系<b><code>xxxx@email.com</code></b>
      </p>
    </footer>
  </div>
</template>

<script>
import Navbar from "./components/Navbar"
// import prob from "@/components/problem"
import "@/scripts/Date"

let hideReturnTop = 0

export default {
  name: "OJ",
  data() {
    return {
      mainHeight: 0, //login没占满，待修改
      oldHeight: 0,
      debounceListener: null,
      editorPage: true,
      navbarHeight: 40,
      taskUUID: "",
      output: "",
      timerId: null,
    }
  },
  computed: {},
  methods: {
    scrollToTop() {
      let sTop = document.documentElement.scrollTop || document.body.scrollTop
      if (sTop > hideReturnTop) {
        window.requestAnimationFrame(this.scrollToTop)
        window.scrollTo(0, sTop - sTop / 8)
        this.$store.commit("setTopState", true)
      }
    },
    goToPage(name, params) {
      this.$store.commit("setTopState", true)
      this.$store.commit("setBottomState", false)
      // if (name === "codeEditor") this.editorPage = false
      if (params !== undefined && params.newPage === true) {
        let routeUrl = this.$router.resolve({
          name,
          params,
        })
        window.open(routeUrl.href, "_blank")
      } else this.$router.push({ name, params })
    },
    windowResizeListener() {
      // debugger
      let newHeight = document.body.clientHeight - this.$refs.navbar.$el.offsetHeight
      if (newHeight !== this.oldHeight) {
        this.mainHeight = newHeight
        this.oldHeight = this.mainHeight
        this.$store.commit("setAvalHeight", this.mainHeight)
        // console.log(document.body.clientHeight)
      }
      // console.log(document.body.clientWidth)
    },
    windowScollerListener(event) {
      //scrollTop是滚动条滚动时，距离顶部的距离
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      //windowHeight是可视区的高度
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      //scrollHeight是滚动条的总高度
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      //顶部判断
      if (scrollTop <= hideReturnTop) {
        if (!this.$store.state.isTop) this.$store.commit("setTopState", true)
        // console.log("top")
      } else {
        if (this.$store.state.isTop) this.$store.commit("setTopState", false)
        // console.log("notTop")
      }
      //底部判断
      if (scrollTop + windowHeight == scrollHeight && !this.$store.state.isBottom) {
        //到了这个就可以进行业务逻辑加载后台数据了
        this.$store.commit("setBottomState", true)
        // console.log("bottom")
      } else if (scrollTop + windowHeight != scrollHeight && this.$store.state.isBottom) {
        this.$store.commit("setBottomState", false)
        // console.log("notBottom")
      }
      //禁止ctrl+滚轮放大
      if (event.ctrlKey === true || event.metaKey) event.preventDefault()
    },
    async getResult() {
      let info = this.userInfo
      let params = {
        uid: info.uid,
        pid: -1, //-1表示是在线编辑器,
        uuid: this.taskUUID,
      }
      //编辑器的输入数据
      let url = `${this.$store.state.webUrl.task.preview}`
      if (url === null) return
      let method = "GET"
      //之后是提交此记录
      this.loading = true
      this.$axios({
        url,
        method,
        params,
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      }).then((response) => {
        if (response.data.code == 1) this.output = response.data.result
      })
    },
    submitUserCode(data) {
      this.output=""
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
        .then(async (response) => {
          this.toast(response.data.result.info)
          this.taskUUID = response.data.result.uuid
          for (let a = 0; a < 0; a++) {
            await this.ojTimer(3000).then(this.getResult)
            if(this.output.length>0)break;
          }
          if(this.output.length==0)this.output="记录可能已经丢失，请重新提交"
        })
        .catch((err) => {
          // debugger
          this.toast(err)
          console.log(err)
        })
    },
  },
  beforeMount() {
    window.addEventListener("mousewheel", this.windowScollerListener, {
      passive: false,
    })
  },
  mounted() {
    this.mainHeight = window.innerHeight - this.$refs.navbar.$el.offsetHeight
    this.navbarHeight = this.$refs.navbar.$el.offsetHeight
    this.oldHeight = this.mainHeight
    this.debounceListener = this.ojDebounce(this.windowResizeListener, 500)
    window.addEventListener("resize", this.debounceListener)
    this.$store.commit("setAvalHeight", window.innerHeight - this.$refs.navbar.$el.offsetHeight)
  },
  components: {
    Navbar,
  },
  beforeDestroy() {
    // if (this.editorPage)
    window.removeEventListener("mousewheel", this.windowScollerListener)
    window.removeEventListener("resize", this.debounceListener)
  },
}
</script>

<style scoped>
#app {
  font-family: tahoma, Avenir, Microsoft YaHei, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 1em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.p-top {
  padding-top: 5%;
}

.body-page {
  width: 100%;
  height: 100%;
  position: relative;
}

.selector-for-some-widget {
  box-sizing: border-box;
  width: 100%;
}
</style>
