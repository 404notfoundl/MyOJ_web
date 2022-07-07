<!--
 * @Author: 
 * @Date: 2022-07-07 15:20:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-07 15:54:35
 * @Description: 请填写简介
-->
<template>
  <div class="row justify-content-center py-3 ">
    <div class="col-lg-7 pt-2 pb-3 bg-white border-radius border">
      <h1 class="border-bottom py-2">感谢注册</h1>
      <div v-if="loading">
        <span class="h5">正在注册中，请稍后</span>
      </div>
      <div v-else>
        <span class="h5">{{ msg }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    pk() {
      return this.$route.params.pk
    },
  },
  data() {
    return {
      loading: true,
      msg: "注册完成",
    }
  },
  methods: {
    regist() {
      this.loading = true
      this.$axios({
        url: this.$store.state.webUrl.user.register,
        method: "PUT",
        data: {
          pk: this.pk,
        },
      })
        .then((response) => {
          this.msg = response.data.result
        })
        .catch((err) => {
          this.msg = err.response.data.result
          this.toast(JSON.stringify(err.response.data.result))
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  mounted() {
    this.regist()
  },
}
</script>

<style scoped>
.bg-white {
  background-color: white;
}
.border-radius{
  border-radius: 5px;
}
</style>
