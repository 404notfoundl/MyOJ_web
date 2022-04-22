<!--
 * @Author: 
 * @Date: 2022-04-22 13:36:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-22 14:02:29
 * @Description: 请填写简介
-->
<template>
  <b-row class="justify-content-center mt-3">
    <b-col lg="7">
      <b-card no-body>
        <b-card-body>
          <!-- 标题部分 -->
          <b-row class="border-bottom">
            <b-col class="float-left">
              <p class="h1 d-inline-block">{{ this.competitionDetail.title }}</p>
              <p class="h6 d-inline-block">发起者:<a href="#">{{ this.competitionDetail.submitter }}</a></p>
            </b-col>
            <b-col></b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "competitionPage",
  data() {
    return {
      competitionDetail: {
        title: "测试比赛",
        description: "测试描述",
        submitter: "admin",
        startDate: new Date().format("MM-dd HH:mm"),
        endDate: new Date().format("MM-dd HH:mm"),
      },
    }
  },
}
</script>

<style></style>
