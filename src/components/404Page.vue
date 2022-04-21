<!--
 * @Author: 
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: 
 * @LastEditTime: 2022-01-30 16:17:26
 * @Description: 请填写简介
-->
<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-6 pt-5">
        <b-card header="404" class="shadow">
          <h1>找不到该页面<br>5秒后返回主页面</h1>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PageNotFound',
  mounted() {
    setTimeout(() => {
      this.$router.push({name:'main'})
    }, 5000);
  },
}
</script>
<style></style>
