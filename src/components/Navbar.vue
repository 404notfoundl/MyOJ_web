<!--
 * @Author: 
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-16 21:14:15
 * @Description: 请填写简介
-->
<template lang="html">
  <div>
    <header class="shadow">
      <b-navbar toggleable="lg" class="py-1" ref="navbar">
        <b-navbar-brand @click="goToPage('main', {})"><b>OJ</b></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item @click="goToPage('main', {})"><b>首页</b></b-nav-item>
            <b-nav-item @click="goToPage('probLib', {})"><b>题库</b></b-nav-item>
            <b-nav-item
              @click="
                goToPage('codeEditor', { isEditMode: true, showIOArea: true, avalHeightRate: 1 })
              "
              ><b>在线编辑器</b>
            </b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item
              right
              class="px-0 py-0"
              @click="
                goToPage('usrInfo', {
                  uid: $store.state.userInfo === null ? null : $store.state.userInfo.uid,
                })
              "
            >
              <b-avatar
                size="36px"
                class="align-middle pr-0 border"
                :src="userInfo != null ? userInfo.avatarUrl : avatarUrl"
                variant="light"
              ></b-avatar>
            </b-nav-item>
            <b-nav-item-dropdown right class="pt-1" v-if="isAuthed">
              <b-dropdown-item
                href="#"
                @click="
                  goToPage('usrInfo', {
                    uid: $store.state.userInfo === null ? null : $store.state.userInfo.uid,
                  })
                "
                >个人信息</b-dropdown-item
              >
              <!-- 此处待修改，检测用户合法性 -->
              <b-dropdown-item href="#" @click="goToPage('appendProblem')" v-if="isAdmin"
                >添加题目</b-dropdown-item
              >
              <b-dropdown-item href="#" @click="goToPage('checkSolution')" v-if="isAdmin"
                >审核题解</b-dropdown-item
              >
              <b-dropdown-item href="#" @click="logout">登出</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
  </div>
</template>
<script>
export default {
  computed: {
    // userInfo() {
    //   let userInfo = this.$store.state.userInfo
    //   return userInfo
    // },
  },
  created() {},
  name: "NavBar",
  props: {
    avatarUrl: {
      type: String,
      default: require("../assets/Akkarin.png"),
    },
  },
  methods: {
    goToPage(pagePath, params) {
      switch (pagePath) {
        case "usrInfo":
          if (!this.isAuthed) {
            pagePath = "login"
          }
          break
      }
      this.$emit("go-to", pagePath, params)
    },
    logout() {
      this.deleteLocal("user")
      this.$store.commit("setUserInfo", null)
      this.$router.replace({ name: "login" })
    },
  },
  mounted() {
    // debugger
    this.isAdmin
  },
  beforeDestroy() {},
}
</script>
<style scoped>
</style>
