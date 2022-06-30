<!--
 * @Author: 
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-12 09:39:53
 * @Description: 请填写简介
-->
<template lang="html">
  <div>
    <header class="shadow-sm">
      <b-navbar toggleable="lg" class="py-1" ref="navbar">
        <b-navbar-brand @click="goToPage('main', {})"><b>OJ</b></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item @click="goToPage('main', {})"><b>首页</b></b-nav-item>

            <!-- <b-nav-item-dropdown class="font-weight" text="题库" right>
              <b-nav-item href="#" @click="goToPage('probLib', {})">主题库</b-nav-item>
            </b-nav-item-dropdown> -->

            <b-nav-item-dropdown  class="font-weight" text="题库" right>
              <b-dropdown-item @click="goToPage('probLib', {})">主题库</b-dropdown-item>
              <b-dropdown-item @click="goToPage('provincialCompetition', {'prov':'all'})">省赛题目</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item @click="goToPage('competitionList', {})">
              <b>比赛</b>
            </b-nav-item>
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
              <div v-if="isAdmin">
                <b-dropdown-item href="#" @click="goToPage('appendProblem')">
                  添加题目
                </b-dropdown-item>
                <b-dropdown-item href="#" @click="goToPage('checkSolution')">
                  审核题解
                </b-dropdown-item>
                <b-dropdown-item href="#" @click="goToPage('addCompetition')">
                  添加比赛
                </b-dropdown-item>
              </div>
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
      // debugger
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
.font-weight {
  font-weight: bold;
}
</style>
