<!--
 * @Author: 
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-12 20:39:00
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
            <b-nav-item-dropdown class="font-weight" text="题库" right>
              <b-dropdown-item @click="goToPage('probLib', { page: 1 })" class='text-center'>主题库</b-dropdown-item>
              <!-- <b-dropdown-item @click="goToPage('provincialCompetition', { prov: 'all' })"
                >省赛题目</b-dropdown-item> -->
            </b-nav-item-dropdown>

            <b-nav-item @click="goToPage('competitionList', {})" disabled title="测试中" v-if="competitionFlag">
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
                <b-dropdown-item href="#" @click="goToPage('addCompetition')" disabled v-if="competitionFlag">
                  添加比赛(测试中)
                </b-dropdown-item>
                <b-dropdown-item href="#" @click="showModifyAnnouncement">
                  修改公告
                </b-dropdown-item>
              </div>
              <b-dropdown-item href="#" @click="logout">登出</b-dropdown-item>
            </b-nav-item-dropdown>            
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>  
      <!-- 修改公告 -->
      <b-modal ref="announceModal" centered size="lg" hide-header @ok="submitAnnounce">
        <b-skeleton-wrapper :loading="loading">
              <template #loading>
                <b-skeleton
                  v-for="(item, index) in Math.ceil(Math.random() * 30)"
                  :width="Math.ceil(Math.random() * 70) + '%'"
                  :key="index"
                ></b-skeleton>
              </template>
              <markdown
                class=""
                :Value.sync="announcementVal"
                showMode="edit"
                :mdPageHeight="avalHeight * 0.8"
                :showToolBar="true"
              >
              </markdown>              
            </b-skeleton-wrapper>
        <template #modal-ok>
          <span>确定</span>
        </template>
        <template #modal-cancel>
  <span>取消</span>
</template>
      </b-modal>

    </header>
  </div>
</template>
<script>
import markdown from "@/components/MdDemo"

export default {
  components: {
    markdown
  },
  computed: {
    // userInfo() {
    //   let userInfo = this.$store.state.userInfo
    //   return userInfo
    // },
  },
  created () { },
  data () {
    return {
      announcementVal: "",
      hasAnnounce: false,
      loading: false
    }
  },
  name: "NavBar",
  props: {
    avatarUrl: {
      type: String,
      default: require("../assets/Akkarin.png"),
    },
  },
  methods: {
    goToPage (pagePath, params) {
      switch (pagePath) {
        case "usrInfo":
          if (!this.isAuthed) {
            pagePath = "login"
          }
          break
      }
      this.$emit("go-to", pagePath, params)
    },
    logout () {
      this.deleteLocal("user")
      this.$store.commit("setUserInfo", null)
      this.$router.replace({ name: "login" })
    },
    showModifyAnnouncement () {
      this.$refs["announceModal"].show()
      this.loading = true
      this.$axios({
        method: "GET",
        url: `${this.$store.state.webUrl.site_config.announcement}`,
      })
        .then((response) => {
          this.announcementVal = response.data.value
          this.hasAnnounce = true
        })
        .catch((err) => {
          this.announcementVal = "暂无"
          this.hasAnnounce = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitAnnounce () {
      let info = this.userInfo
      let data = {
        key: "announcement",
        value: this.announcementVal,
        backup: info.username,
        backup_2: info.uid,
      }
      let url = this.hasAnnounce ? `${this.$store.state.webUrl.site_config.announcement}` : `${this.$store.state.webUrl.site_config.self}/`
      this.$axios({
        method: this.hasAnnounce ? "PUT" : "POST",
        url,
        data,
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      })
        .then((response) => {
          this.toast("成功")
        })
        .catch((err) => {
          this.toast("失败")
          console.log(err.response)
        })

    }
  },
  mounted () {
    // debugger
    this.isAdmin
  },
  beforeDestroy () { },
}
</script>
<style scoped>
.font-weight {
  font-weight: bold;
}
</style>
