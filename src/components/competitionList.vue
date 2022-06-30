<!--
 * @Author: 
 * @Date: 2022-04-22 09:18:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-29 20:32:44
 * @Description: 请填写简介
-->
<template>
  <b-row class="justify-content-center mt-3">
    <b-col lg="7">
      <b-card no-body>
        <b-card-body>
          <b-row class="px-2">
            <b-col>
              <!-- 表 -->
              <!-- <b-row>
                <b-col
                  :class="getTableUnitStyle(index, listName.length, true)"
                  v-for="(item, index) in listName"
                  :key="item.id"
                  :cols="listName[index].col"
                  ><b>{{ item.label }}</b></b-col
                >
              </b-row>
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
              </b-row> -->
              <b-table
                id="competitionList"
                @row-selected="rowSelected"
                selectable
                select-mode="single"
                small
                :fields="listName"
                :items="getCompetitionList"
                striped
                hover
                responsive
                fixed
              >
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>加载中...</strong>
                  </div>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="pageCols"
                aria-controls="competitionList"
                first-number
                last-number
                align="center"
              >
              </b-pagination>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "competitionList",
  computed: {
    pageCols: function () {
      return Math.floor(this.avalHeight / 40)
    },
  },
  data() {
    return {
      // col总计为12
      listName: [
        { key: "id", label: "#", col: 2 },
        { key: "title", label: "名称", col: 6 },
        { key: "startDate", label: "开始日期", col: 2, formatter: "dateFormat" },
        { key: "endDate", label: "结束日期", col: 2, formatter: "dateFormat" },
        // { key: "accepted", label: " " },
      ],
      competitionList: [
        { id: 1, title: "暂无", startDate: new Date(), endDate: new Date(), existed: false },
      ],
      currentPage: 1,
      rows: 0,
    }
  },
  methods: {
    getCompetitionList: function (ctx, callback) {
      this.$axios({
        url: `${this.$store.state.webUrl.competition.self}/`,
        params: {
          page: this.currentPage,
          cols: this.pageCols,
        },
      })
        .then((response) => {
          // debugger
          this.rows = response.data[0].total
          response.data.splice(0, 1)
          if (response.data.length > 0) this.competitionList = response.data
          callback(this.competitionList)
        })
        .catch((error) => {
          console.log(error)
          callback([])
        })
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
    dateFormat(val) {
      let date = new Date(val).format("yy-MM-dd HH:mm:SS")
      return date
    },
    rowSelected(item) {
      // console.log(item)
      if (item[0] != undefined && item[0].existed === undefined) {
        let params = {
          cid: item[0].id,
        }
        this.$emit("go-to", "competitionPage", params)
      }
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
