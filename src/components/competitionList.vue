<!--
 * @Author: 
 * @Date: 2022-04-22 09:18:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-22 13:47:19
 * @Description: 请填写简介
-->
<template>
  <b-row class="justify-content-center mt-3">
    <b-col lg="7">
      <b-card no-body>
        <b-card-body>
          <b-row class="px-2">
            <b-col>
              <!-- 表头 -->
              <b-row>
                <b-col
                  :class="getTableUnitStyle(index, listName.length, true)"
                  v-for="(item, index) in listName"
                  :key="item.id"
                  :cols="listName[index].col"
                  ><b>{{ item.label }}</b></b-col
                >
              </b-row>
              <!-- 表身 -->
              <b-row
                v-for="(items, cnt) in getCompetitionList()"
                :key="items.id"
                @click="jumpToPage({ cid: items.id })"
                class="td"
              >
                <b-col
                  :cols="listName[index].col"
                  v-for="(value, key, index) in items"
                  :class="getTableUnitStyle(index, competitionList.length, false, cnt)"
                  :key="index"
                >
                  {{ value }}
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name:"competitionList",
  data() {
    return {
      // col总计为12
      listName: [
        { key: "id", label: "#", col: 2 },
        { key: "title", label: "名称", col: 6 },
        { key: "startDate", label: "开始日期", col: 2 },
        { key: "endDate", label: "结束日期", col: 2 },
        // { key: "accepted", label: " " },
      ],
      competitionList: {},
    }
  },
  methods: {
    getCompetitionList: function (ctx, callback) {
      this.competitionList = [
        {
          id: 1,
          title: "测试比赛1",
          startDate: new Date().format("MM-dd HH:mm"),
          endDate: new Date().format("MM-dd HH:mm"),
        },
        {
          id: 2,
          title: "测试比赛2",
          startDate: new Date().format("MM-dd HH:mm"),
          endDate: new Date().format("MM-dd HH:mm"),
        },
        {
          id: 3,
          title: "测试比赛3",
          startDate: new Date().format("MM-dd HH:mm"),
          endDate: new Date().format("MM-dd HH:mm"),
        },
        {
          id: 4,
          title: "测试比赛4",
          startDate: new Date().format("MM-dd HH:mm"),
          endDate: new Date().format("MM-dd HH:mm"),
        },
      ]
      return this.competitionList
    },
    getTableUnitStyle(index, length, isTitle, cnt) {
      return `${isTitle ? "border-top" : ""} border-bottom py-1 ${
        index == 0 ? "border-left" : ""
      } ${index == length - 1 ? "border-right" : ""} 
      ${cnt & 1 && !isTitle ? "td-odd" : "td-even"} 
      border-color`
    },
    jumpToPage(params) {
      this.$emit("go-to", "competitionPage", params)
    },
  },
}
</script>

<style scoped>
.td-even {
  background-color: rgb(255, 255, 255);
}
.td-odd {
  background: rgb(226, 223, 182);
}
.td:hover {
  opacity: 60%;
}
.border-color {
  border-bottom-color: rgb(211, 202, 221) !important;
}
</style>
