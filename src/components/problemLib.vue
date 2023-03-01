<!--
 * @Author: 
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-28 14:46:08
 * @Description: 请填写简介
-->
<template lang="">
  <div class="pt-3">
    <div class="row justify-content-center">
      <div class="col-lg-6 prob-lib-position-lg">
        <!-- 题库栏 -->
        <b-card no-body class="w-100 z-t">
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
                  :key="tableKey">
                  <template #table-busy>
                    <div class="text-center text-danger my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong>加载中...</strong>
                    </div>
                  </template>
                  <template :slot="`cell(label)`" slot-scope="data">
                    <div class="">
                      <b-badge
                        class="ml-1"
                        variant="secondary"
                        v-for="(item, index) in data.value.split(',')"
                        :key="item"
                        v-show="index < 2"
                      >
                        {{ item }}
                      </b-badge>
                    </div>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-pagination v-model='currentPage' :total-rows="rows" :per-page='pageCols' aria-controls="probList"
                  first-number last-number align="center" @change="nextPage">
                </b-pagination>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card> 
        <!-- 搜索栏 -->
        <b-row :class="`panel-${showSearch?'show':'hide'} w-30 position-absolute d-show-st-lg z-b`">
          <b-col cols="10" class="px-0">
            <b-card no-body class="br-0">
              <b-card-body>
                <b-form @submit.prevent="searchProb">
                  <!-- 搜索按钮 -->
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
                  <!-- 输入框 -->
                  <b-row>
                    <b-col>
                      <b-form-group>
                        <b-form-input 
                          type="search" 
                          trim 
                          v-model.lazy="searchKey.pid" 
                          placeholder="题目编号/标题"
                        >
                        </b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <!-- 标签筛选 -->
                  <b-row>
                    <b-col>
                      <span class='h6 text-muted d-block mb-0' v-b-toggle="'fliter-labels'">
                        标签筛选
                        <svg class="bi bi-arrows-collapse" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8zm6-7a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V1.5A.5.5 0 0 1 8 1z"/>
                          <path fill-rule="evenodd" d="M10.354 3.646a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L8 5.293l1.646-1.647a.5.5 0 0 1 .708 0zM8 15a.5.5 0 0 0 .5-.5V10a.5.5 0 0 0-1 0v4.5a.5.5 0 0 0 .5.5z"/>
                          <path fill-rule="evenodd" d="M10.354 12.354a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 .708.708L8 10.707l1.646 1.647a.5.5 0 0 0 .708 0z"/>
                        </svg>
                      </span>
                      <b-collapse id='fliter-labels' class="py-1" v-model="labelFilterFlag">
                        <b-badge 
                          class='ml-1 py-1'
                          pill variant='light'
                          v-for="value in siteLabels"
                          :key="value.word" size='lg'
                          href="#"
                          :active="searchKey.selectedLabel==value.word"
                          @click="labelClick(value.word)"
                          >
                          {{value.word}}
                        </b-badge>
                      </b-collapse>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-col>
          <b-col cols="2" class="px-0">
            <b-button :class="`button-${showSearch?'show':'hide'} search-panel-collapse-button-lg`" squared variant="outline-secondary" @click="collapsePanel">
              <p class="h6 my-0" v-show="!showSearch">&gt;</p>
              <p class="h6 my-0" v-show="showSearch">&lt;</p>       
            </b-button>
          </b-col>
        </b-row>      
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "problemLib",
  computed: {
    pageCols: function () {
      return Math.floor((this.$store.state.avaliableHeight / 35 * 0.8))
    },
    pidIsInt () {
      return (Number.isInteger(Number(this.searchKey.pid)) && Number(this.searchKey.pid) > 0) && this.searchKey.pid !== ''
    },
    currentPageComp: function () {
      return this.$route.params.page != undefined ? this.$route.params.page : 1
    },
    tableKey () {
      let key = ""
      for (let qkey in this.query_data)
        key += this.query_data[qkey]
      key += this.searchKey.selectedLabel
      key += this.currentPageComp
      return key
    }
  },
  created () {
    this.getSiteLabels()
  },
  data () {
    return {
      showSearch: false,
      currentPage: this.$route.params.page != undefined ? this.$route.params.page : 1,
      // pageCols: 20,//一页的列数
      problemList: {},
      rows: 10,
      searchKey: {
        pid: '',
        selectedLabel: ''
      },
      listName: [{ key: 'pid', label: '#' }, { key: 'title', label: '名称', class: 'w-50' }, { key: 'label', label: '标签', class: 'w-20' }, { key: 'acceptNum', label: '通过' }, { key: 'submitNum', label: '提交' }],
      query_data: {},
      siteLabels: [],
      labelFilterFlag: false
    }
  },
  methods: {
    getProbList (ctx, callback) {
      //有待修改，还在测试
      let params = {
        page: this.currentPage,
        cols: this.pageCols
      }
      for (let key in this.query_data)
        params[key] = this.query_data[key]

      this.$axios({
        url: `${this.$store.state.webUrl.problems}`,
        params
      }).then((response) => {
        this.problemList = response.data
        this.rows = this.problemList[0].total
        this.problemList.splice(0, 1)
        this.$nextTick(() => { this.currentPage = this.currentPageComp })
        callback(this.problemList)
      })
        .catch(function (error) {
          console.log(error)
          callback([{ pid: 0, title: '可能是网络出现了问题，稍后刷新一下试试?' }])
        }).finally(() => { return true; })
    },
    jumpToProb (props) {
      this.$emit('go-to', 'problemObj', props)
    },
    searchProb () {
      if (!this.pidIsInt) {
        this.query_data = {
          'title__contains': this.searchKey.pid,
          'label__contains': this.searchKey.selectedLabel
        }
        return
      }
      this.jumpToProb(this.searchKey)
    },
    collapsePanel () {
      return this.showSearch = !this.showSearch
    },
    rowSelected (item) {
      this.jumpToProb({ 'pid': item[0].pid })
    },
    nextPage (page) {
      this.$emit('go-to', 'probLib', { page })
    },
    getSiteLabels () {
      return this.$axios({
        url: `${this.$store.state.webUrl.label}`,
      }).then((response) => {
        this.siteLabels = response.data
      })
    },
    labelClick (label) {
      if (this.searchKey.selectedLabel != label)
        this.searchKey.selectedLabel = label
      else
        this.searchKey.selectedLabel = ''
      this.searchProb()
    },
  },
  watch: {
    currentPageComp () {
      this.currentPage = this.currentPageComp
    },
    showSearch (value) {
      if (!value && this.labelFilterFlag || value && !this.labelFilterFlag)
        this.$root.$emit('bv::toggle::collapse', 'fliter-labels')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/sass/bootstrap.scss";
$right-start: -(100vw * 0.01);
$top-pos: 10px;
$right-end: -(100vw * 0.14);

$top-start: -(100vh * 0.01);
$right-pos: 10px;
$top-end: -(100vh * 0.14);

@each $gKey, $gVal in $grid-breakpoints {
  @media (max-width: $gVal) {
    // 插值语法
    //小于一定范围 small than
    .d-pos-abs-st-#{$gKey} {
      position: absolute !important;
    }
    .prob-lib-position-#{$gKey}{
      display: flex;
      flex-direction: column-reverse;
    }
    .search-panel-collapse-button-#{$gKey}{
      transform: rotate(-90deg)
    }
    .d-show-st-#{$gKey} {
      display: none;
    }
  }
  @media (min-width: $gVal) {
    //大于一定范围 large than
    .d-pos-abs-lt-#{$gKey} {
      position: absolute !important;
    }
    .prob-lib-position-#{$gKey}{
      position: relative;
    }
  }
}

@media (min-width: map-get($grid-breakpoints,lg)) {
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
}

// TODO 完成此模式下的搜索面板
@media (max-width: map-get($grid-breakpoints,lg)) {
}

.z-t {
  z-index: 1020 !important;
}
.z-b {
  z-index: 1000 !important;
}



button {
  background-color: white;
}

.btn-outline-secondary {
  border: 1px solid #d0d7db;
}

.active {
  background-color: black !important;
  color: white !important;
}
</style>