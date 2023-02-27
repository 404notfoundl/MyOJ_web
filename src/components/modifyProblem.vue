<template lang="">
  <div class="container-lg">
    <div class="row py-3">
      <div class="col">
        <b-card class="">
          <edit-page
            @submit="submitProblem"
            :oldProblem="newProblem"
            :mode="mode"
            @onSave="onMdSave"
            :key="oldProblem.pid"
            :nextStep="step"
            @submit_code="submitTestCode"
            :loading="loading"
          >
            <template v-slot:extra>
              <div class='pt-2 text-info' @click="showMsgModal">{{extraMsg}}</div>
            </template>
            <template v-slot:spj_result>
  <p v-if="rtnCode">{{ loading ? "请等待结果" : "等待提交验证代码" }}</p>
  <div v-else>
    <p class="font-weight-bolder text-left mb-1">运行结果：</p>
    <b-form-radio-group v-model="selectFliter" :options="fliterTypes" class="">
    </b-form-radio-group>
    <b-list-group
      class="scroller py-1 br-0"
      :style="`max-height:${avalHeight * 0.64}px;`"
    >
      <b-list-group-item
        v-for="(key, index) in rtnRes.status"
        :key="index"
        class="py-1 text-wrap text-monospace text-break"
        v-show="fliterResults(index)"
      >
        <div class="font-weight-bold d-inline-block">#{{ index }}:</div>
        <div class="font-weight-light d-inline-block text-left">
          {{ rtnRes.details[index] }}
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>          
          </edit-page>
        </b-card>
      </div>
    </div>
    <b-modal ref="errModal" centered size="lg"  :hide-footer="showFooter" hide-header @ok="toNext">
      <markdown
        class=""
        :Value="formattedMsg"
        showMode="preview"
        :mdPageHeight="avalHeight * 0.8"
        :showToolBar="false"
      >
      </markdown>
      <template v-slot:modal-ok>
        确定
      </template>
      <template v-slot:modal-cancel>
        取消
      </template>
    </b-modal>
  </div>
</template>
<script>
import editPage from "./editProblemPage"
import markdown from "@/components/MdDemo"

export default {
  name: "modifyProblem",
  beforeRouteEnter (to, from, next) {
    // 修改题目但没有原题数据时
    if (to.name === "modifyProblem" && to.params.oldProblem === undefined) {
      next({ name: "probLib" })
    } else next()
  },
  components: {
    "edit-page": editPage,
    markdown
  },
  computed: {
    routeName () {
      return this.$route.name
    },
  },
  async created () {
    this.load()
    await this.getSpjRes()
    this.showFooter = true
    if (this.rtnCode == 0) {
      this.$nextTick(() => {
        this.formattedMsg = '### 发现了上次提交的spj题目，是否进入下一步?'
        this.showMsgModal(true)
      })
    }
    this.showFooter = false
  },
  data () {
    return {
      newProblem: null,
      step: 0,
      formattedMsg: '',
      extraMsg: '',
      getting: false,
      rtnCode: -1,
      showFooter: false,
      rtnData: {},
      rtnRes: {},
      loading: false,
      selectFliter: 0,
      fliterTypes: [
        { 'text': '全部', 'value': 0 },
        { 'text': '出错', 'value': 1 },
      ]
    }
  },
  methods: {
    fliterResults (index) {
      switch (this.selectFliter) {
        case 0:
          return true
        case 1:
          return this.rtnRes.status[index] !== 'a'
      }
    },
    getSpjRes (type = 0) {
      let method = "GET"
      let params = {
        task_id: type == 0 ? this.getLocalString('spj_id') : this.getLocalString('spj_test_id')
      }
      console.log(params.task_id)
      let url = `${this.$store.state.webUrl.api.spj}`
      let info = this.userInfo
      return this.$axios({
        url,
        method,
        params,
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      }).then((response) => {
        this.rtnCode = response.data.code
        if (this.rtnCode != 1) {
          this.formattedMsg = this.formatErrMsg("cpp", response.data.err)
          if (this.rtnCode == 2)
            this.extraMsg = "出现了错误，详情...", this.showFooter = false
          else if (response.data.data != undefined) {
            if (type == 0) {
              this.rtnData = JSON.parse(response.data.data)
              this.newProblem.title = this.rtnData.title
              this.newProblem.difficulty = this.rtnData.difficulty
            } else {
              this.rtnRes = JSON.parse(response.data.data)
              this.rtnRes.details = this.rtnRes.details.split('#')
            }
          }
        }
      })
    },
    submitProblem (data) {
      if (this.step == 1)
        return this.getTestResult()
      if (this.step == 2) {
        this.$router.push({ name: 'probLib', params: { page: 1 } })
      }
      let method = "POST"
      let url = `${this.$store.state.webUrl.save}`
      if (this.$route.params.pid !== undefined) {
        method = "PUT"
        url += `${this.$route.params.pid}/`
      }
      let info = this.userInfo
      this.rtnCode = 1
      this.loading = true
      return this.$axios({
        url,
        method,
        formData: data,
        transformRequest: [
          function () {
            return data
          },
        ],
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${info.token}`,
        },
      })
        .then(async (response) => {
          this.toast(response.data.result, 3000)
          if (response.data.code == 1) {
            this.setLocalString("spj_id", response.data.result), this.extraMsg = "请等待结果"
            for (let a = 0; a < 5; a++) {
              if (this.rtnCode == 1)
                await this.ojTimer(5000).then(this.getSpjRes)
            }
            if (this.rtnCode == 1) this.extraMsg = "暂未查询到结果，您可以点击刷新或重新提交"
            else if (this.rtnCode == 0) this.next()
          }
          else
            this.$router.replace({ name: "probLib", params: { page: 1 } })
        })
        .catch((err) => {
          this.toast(err.data.result)
        }).finally(() => { this.loading = false })
    },
    onMdSave (value) {
      this.save(value)
    },
    save (value) {
      if (value !== null && value !== undefined) this.newProblem.value = value
      this.saveMdBorwser("add", "temporary", this.newProblem)
    },
    load () {
      if (this.oldProblem.pid !== null) this.newProblem = this.oldProblem
      else this.newProblem = this.getMdBorwser("add", "temporary")
      if (this.newProblem == null) this.newProblem = this.oldProblem
    },
    showMsgModal (show = false) {
      if (this.rtnCode == 1) {
        this.getSpjRes()
      } else if (this.rtnCode == 2 || show)
        this.$refs["errModal"].show()
    },
    formatErrMsg (lang, str) {
      return "```" + lang + "\n" + str + "\n" + "```"
    },
    toNext () {
      // 出错不进入下一步
      if (this.rtnCode == 2) return
      this.next()
      this.newProblem.method = 1
      this.rtnCode = 1
      this.getSpjRes(1)
    },
    submitTestCode (data) {
      this.rtnCode = 1
      data['task_id'] = this.getLocalString('spj_id')
      let method = "POST"
      let url = `${this.$store.state.webUrl.api.spj}`
      let info = this.userInfo
      return this.$axios({
        url,
        method,
        data,
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      }).then(async (response) => {
        this.setLocalString("spj_test_id", response.data.result)
        this.rtnData = response.data
        this.loading = true
        for (let a = 0; a < 10; a++) {
          if (this.rtnCode == 1)
            await this.ojTimer(5000).then(this.getSpjRes(1))
          else break;
        }
      }).finally(() => { this.loading = false })
    },
    next () {
      this.step++
    },
    getTestResult () {
      let method = "GET"
      let url = `${this.$store.state.webUrl.api.spj}${this.getLocalString("spj_test_id")}/`
      let info = this.userInfo
      let params = {
        prob_id: this.getLocalString("spj_id")
      }
      return this.$axios({
        url,
        method,
        params,
        headers: {
          authorization: `Bearer ${info.token}`,
        },
      }).then((response) => {
        this.toast(response.data.result, 5000)
        if (!response.data.code) this.next()
      })
    }
  },
  props: {
    oldProblem: {
      type: Object,
      default: () => {
        return {
          info: {
            limits: [{ timeLimit: 1000, memoryLimit: 128 }],
          },
          province: "",
          year: null,
          pid: null,
          title: "",
          label: "",
          difficulty: "",
          value: "## 问题描述 \n\n## 输入数据\n\n## 输出数据\n\n## 数据范围/提示",
          inputFiles: null,
          outputFiles: null,
          method: 0,
          spjFile: null,
        }
      },
    },
    mode: {
      type: String,
      default: "modify",
    },
  },
  watch: {
    routeName () {
      this.load()
    },
  },
}
</script>
<style lang="scss" slot-scope>
.form-control {
  padding: 0;
  border-bottom: 1px solid #dbdbdb;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
}

input {
  &:focus {
    outline: 0;
    box-shadow: none;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
}

.pos-right-bottom {
  position: absolute;
  right: 2%;
  top: 0;
}

.custom-file-input:lang(zh-CN) ~ .custom-file-label::after {
  display: none;
}

.bg-white {
  background-color: white;
}
</style>
