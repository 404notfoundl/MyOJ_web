<!--
 * @Author: 
 * @Date: 2022-04-26 13:06:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-27 11:19:38
 * @Description: 编辑题目的组件
-->
<template>
  <div class="w-100 h-100">
    <b-form @submit.prevent="submitProblem">
      <!-- 标题 -->
      <b-row class="justify-content-center fill-x mb-2">
        <b-col>
          <div class="d-inline-block">
            <p class="h5">标题:</p>
          </div>
          <div class="d-inline-block">
            <b-form-group lable="标题:" label-for="title">
              <b-form-input
                id="title"
                v-model="newProblem.title"
                placeholder="输入标题"
                required
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="d-inline-block">
            <p class="font-weight-light h6">难度:</p>
          </div>
          <div class="d-inline-block">
            <b-form-group lable="难度:" label-for="difficulty">
              <b-form-input
                id="difficulty"
                v-model="newProblem.difficulty"
                placeholder="输入难度"
                required
              >
              </b-form-input>
            </b-form-group>
          </div>
          <div class="d-inline-block pos-right-bottom">
            <b-button variant="outline-secondary" squared size="lg" :pressed="false" type="submit">
              <p class="h6 d-inline">
                <b>{{ submitTitle }}</b>
              </p>
            </b-button>
          </div>
        </b-col>
      </b-row>
      <hr class="mb-0" />
      <b-row class="justify-content-left fill-x fill-b flex-row-reverse">
        <b-col>
          <b-form-group>
            <div class="pt-2">
              <b-row>
                <b-col cols="4" class="pr-0 h-auto pt-1">
                  <p class="mb-0">时限(ms):</p>
                </b-col>
                <b-col cols="8" class="pl-0 h-auto">
                  <b-form-input
                    id="timeLimit"
                    v-model="newProblem.info.limits[0].timeLimit"
                    placeholder="输入数字"
                    type="number"
                    required
                  >
                  </b-form-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="pr-0 h-auto pt-1">
                  <p class="mb-0">空限(MB):</p>
                </b-col>
                <b-col cols="8" class="pl-0 h-auto">
                  <b-form-input
                    id="timeLimit"
                    v-model="newProblem.info.limits[0].memoryLimit"
                    placeholder="输入数字"
                    type="number"
                    required
                  >
                  </b-form-input>
                </b-col>
              </b-row>
            </div>
            <hr />
          </b-form-group>
          <!-- 题目详情的折叠区域 -->
          <!-- 标签 -->
          <b-row align-h="center">
            <b-col cols="4" class="px-0">
              <b-button
                variant="outline-secondary"
                squared
                size="sm"
                class="border-0 px-0 py-0"
                v-b-toggle.problemLabel
                :pressed="false"
                disabled
              >
                <p class="h6 d-inline">标签</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-chevron-double-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="">
              <b-form-group lable="标签:" label-for="label">
                <b-form-input
                  id="label"
                  v-model.trim="newProblem.label"
                  placeholder="输入标签，','为分隔符"
                  required
                >
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <hr />
          <!-- 输入输出数据 -->
          <div>
            <p class="h6 text-info">
              <b>{{ warn }}</b>
            </p>
            <div>
              <p class="h6"><b>注意:</b>输入输出文件应当同名,后缀分别为<b>.in</b>和<b>.out</b></p>
              <b-form-file
                v-model="newProblem.inputFiles"
                :state="false"
                placeholder="选择输入数据"
                multiple
                drop-placeholder=".in文件放入此处"
                size="sm"
                accept=".in"
                :required="!new_file_flag"
                :disabled="new_file_flag"
              ></b-form-file>
              <b-form-file
                v-model="newProblem.outputFiles"
                :state="false"
                placeholder="选择输出数据"
                multiple
                drop-placeholder=".out文件放入此处"
                size="sm"
                class="mt-2"
                accept=".out"
                :disabled="new_file_flag"
                :required="!new_file_flag"
              ></b-form-file>
            </div>
            <b-form-checkbox v-model="new_file_flag" v-show="!label_display_none[route.name]"
              ><h6>不添加新文件</h6></b-form-checkbox
            >
          </div>
        </b-col>
        <!-- markdown -->
        <b-col class="px-0 border-right" lg="9">
          <markdown
            id="markdown"
            :mdPageHeight="avalHeight * heightRate"
            :Value.sync="newProblem.value"
            showMode="edit"
            :showToolBar="true"
            :editMode="this.mode"
            :problem="newProblem"
          >
          </markdown>
          <b-popover ref="mdPopover" target="markdown" title="注意" :disabled="true" variant="info">
            此处不能为空
          </b-popover>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>
<script>
import markdown from "@/components/MdDemo"

export default {
  name: "editProblem",
  components: {
    markdown,
  },
  computed: {},
  created() {},
  data() {
    return {
      newProblem: this.oldProblem, // 为了省事直接用了，待修改
      user: {},
      warn: "",
      validate: false,
      label_old: this.oldProblem.label,
      label_display_none: {
        addCompetition: true,
        appendProblem: true,
      },
      new_file_flag: false,
    }
  },
  methods: {
    serializer() {
      let value = this.newProblem
      value["label_old"] = this.label_old
      let form = new FormData()
      form.append("timeLimit", this.newProblem.info.limits[0].timeLimit)
      form.append("memoryLimit", this.newProblem.info.limits[0].memoryLimit)
      for (let cnt in this.newProblem.inputFiles) {
        form.append("input", this.newProblem.inputFiles[cnt])
        form.append("output", this.newProblem.outputFiles[cnt])
      }
      for (let key in value) {
        form.append(key, value[key])
      }
      return form
    },
    checkLabelsValid() {
      // 四则运算,入门,#,#,#,#,#,#,#,#
      let result = true
      let modelStr = /^[\u4e00-\u9fa5,a-zA-Z0-9 ]+$/
      result = modelStr.test(this.newProblem.label)
      if (!result) {
        this.warn = "标签只应包含汉字，字母和数字，并且以','为分割"
        return result
      }
      //删除空串
      let strs = this.newProblem.label.split(",")
      let strLen = strs.length
      for (let a = 0; a < strLen; a++) if (strs[a] === "") strs.splice(a, 1), a--, strLen--

      this.newProblem.label = strs.toString()
      this.warn = ""
      return result
    },
    checkFilesValid() {
      if (this.newProblem.inputFiles === null || this.newProblem.outputFiles === null) return false
      let map = {}
      let inputLength = 0,
        outputLength = 0
      for (let ind = 0; ind < this.newProblem.inputFiles.length; ind++) {
        let item = this.newProblem.inputFiles[ind]
        let str = item.name.split(".")[0]
        map[str] = true
        inputLength++
      }
      for (let ind = 0; ind < this.newProblem.outputFiles.length; ind++) {
        let item = this.newProblem.outputFiles[ind]
        let str = item.name.split(".")[0]
        outputLength++
        if (map[str]) delete map[str]
        else {
          this.warn = `存在未配对文件${item.name}`
          return false
        }
      }
      if (inputLength !== outputLength) {
        this.warn = "输入文件过多"
        return false
      }
      this.warn = ""
      // this.validate = true
      return true
    },
    submitProblem() {
      if (this.checkLabelsValid()) {
        if (!this.new_file_flag) if (!this.checkFilesValid()) return
      } else return

      if (this.newProblem.value === "") {
        this.$refs.mdPopover.$emit("open")
        setTimeout(() => {
          this.$refs.mdPopover.$emit("close")
        }, 5000)
        return
      }
      let data = this.serializer()
      this.newProblem.label_old = this.label_old
      this.$emit("submit", data)
      this.$emit("update:value", this.newProblem)
      // this.toast("成功")
    },
  },
  props: {
    oldProblem: {
      type: Object,
      default: () => {
        return {
          info: {
            limits: [{ timeLimit: "", memoryLimit: "" }],
          },
          title: "",
          label: "",
          difficulty: "",
          value: "",
          inputFiles: null,
          outputFiles: null,
        }
      },
    },
    mode: {
      type: String,
      default: "modify",
    },
    submitTitle: {
      type: String,
      default: "提交",
    },
    heightRate: {
      type: Number,
      default: 1,
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
</style>
