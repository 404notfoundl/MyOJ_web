<!--
 * @Author: 
 * @Date: 2022-06-11 21:02:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-12 14:59:15
 * @Description: 请填写简介
-->
<template lang="">
  <div class="pt-3">
    <div class="row justify-content-center">
      <div class="col-lg-6 position-relative">
        <!-- 题库栏 -->
        <b-card no-body class="z-t">
          <b-card-body>
            <b-row>
              <b-col>
                <b-table                 
                  striped 
                  hover 
                  :items='getProbList' 
                  :fields="listName" 
                  small 
                  primary-key='pid' 
                  outlined
                  selectable
                  select-mode="single"
                  @row-selected="rowSelected"
                  id='probList' 
                  :per-page="pageCols" 
                  :current-page="currentPage"
                  :key="tableKey">
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
                <b-pagination v-model='currentPage' :total-rows="rows" :per-page='pageCols' aria-controls="probList"
                  first-number last-number align="center">
                </b-pagination>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card> 
        <!-- 搜索栏 -->
        <div>
          <div v-show="false">
            <b-row :class="`position-absolute panel-${showSearch?'show':'hide'} w-30 z-b`">
              <b-col cols="10" class="px-0">
                <b-card no-body>
                  <b-card-body>
                    <b-form @submit.prevent="searchProb">
                      <b-row>
                        <b-col>
                          <b-form-group>
                            <b-button variant="outline-primary" small squared type="submit" block>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                              </svg>
                            </b-button>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col>
                          <b-form-group>
                            <b-form-input 
                            type="search" 
                            trim 
                            number
                            required
                            v-model.lazy="searchKey.pid" 
                            placeholder="输入题目编号">
                            </b-form-input>
                            <p class="h6 mb-0" v-show="!pidIsInt">应当是整数</p>
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </b-form>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-col cols="2" class="px-0">
                <b-button :class="`button-${showSearch?'show':'hide'}`" squared variant="outline-secondary" @click="showSearch=!showSearch">
                  <p class="h6 my-0" v-show="!showSearch">&gt;</p>
                  <p class="h6 my-0" v-show="showSearch">&lt;</p>       
                </b-button>
              </b-col>
            </b-row>
          </div>
        </div>       
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "provincialCompetition",
  computed: {
    pageCols: function () {
      return Math.floor((this.$store.state.avaliableHeight / 35 * 0.8))
    },
    pidIsInt () {
      return (Number.isInteger(this.searchKey.pid) && this.searchKey.pid > 0) || this.searchKey.pid == ''
    },
    province () {
      return this.route.params.prov === 'all' ? undefined : this.route.params.prov
    },
    year () {
      return this.route.params.year
    }
  },
  created () {
  },
  data () {
    return {
      tableKey: 0,
      showSearch: false,
      currentPage: 1,
      // pageCols: 20,//一页的列数
      problemList: {},
      rows: 10,
      searchKey: {
        pid: ''
      },
      listName: [],
      labels: {
        prov: [{ key: 'province', label: '省份' }],
        year: [{ key: 'year', label: '年份' }, { key: 'count', label: '题数' }],
        problems: [{ key: 'pid', label: '#' }, { key: 'title', label: '标题' }]
      }
    }
  },
  methods: {
    setLabelMap () {
      if (this.province === undefined) this.listName = this.labels.prov
      else if (this.year === undefined) this.listName = this.labels.year
      else this.listName = this.labels.problems
    },
    getProbList (ctx, callback) {
      // TODO 后端分页      
      this.setLabelMap()
      this.$axios({
        url: `${this.$store.state.webUrl.provincial_competition.self}/`,
        params: {
          page: this.currentPage,
          cols: this.pageCols,
          province: this.province,
          year: this.year
        }
      }).then((response) => {

        this.problemList = response.data
        this.rows = this.problemList[0].total
        this.rows = 20
        // this.problemList.splice(0, 1)
        callback(this.problemList)
      })
        .catch(function (error) {
          console.log(error)
          callback([{ pid: 0, title: '可能是网络出现了问题，稍后刷新一下试试?' }])
        })

    },
    jumpToProb (props) {
      let target = "provincialCompetition"
      if (props.pid !== undefined) target = "provincialCompetitionPage"
      this.$emit('go-to', target, props)
    },
    rowSelected (item) {
      let data = {}
      data.pid = item[0].pid
      data.year = item[0].year == undefined ? this.year : item[0].year
      data.prov = item[0].province === undefined ? this.province : item[0].province
      this.jumpToProb(data)
    }
  },
  watch: {
    province () {
      this.tableKey++
    },
    year () {
      this.tableKey++
    }
  }
}
</script>
<style lang="scss" scoped>
$right-start: 0;
$top-pos: 10px;

$right-end: -28%;

@keyframes search-panel {
  from {
    right: $right-start;
  }
  to {
    right: $right-end;
  }
}

.search-panel-s {
  top: $top-pos;
  right: $right-end;
}

.search-panel-h {
  top: $top-pos;
  right: $right-start;
}

.search-panel-show,
.search-panel-hide {
  top: $top-pos;
  animation-name: search-panel;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.search-panel-hide {
  animation-direction: reverse;
}

.z-t {
  z-index: 1020 !important;
}
.z-b {
  z-index: 1000 !important;
}

.panel-hide {
  top: $top-pos;
  right: $right-start;
}

.panel-show {
  top: $top-pos;
  right: $right-end;
}

.button-show {
  height: 25%;
}

.button-hide {
  height: 100%;
}

.panel-hide,
.panel-show,
.button-show,
.button-hide {
  transition-property: right, height;
  transition-duration: 0.5s;
}

.w-30 {
  width: 30%;
}

button {
  background-color: white;
}
</style>