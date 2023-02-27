<!--
 * @Author: 
 * @Date: 2022-04-26 13:06:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-24 16:49:58
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
                :disabled="step != 0"
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
                :disabled="step != 0"
              >
              </b-form-input>
            </b-form-group>
          </div>
          <div class="d-inline-block pos-right-bottom">
            <b-button
              variant="outline-secondary"
              squared
              size="lg"
              :pressed="false"
              :disabled="loading"
              type="submit"
            >
              <p class="h6 d-inline">
                <b>{{ submitTitleD }}</b>
              </p>
            </b-button>
          </div>
        </b-col>
      </b-row>
      <hr class="mb-0" />
      <b-row class="justify-content-left fill-x fill-b flex-row-reverse">
        <!-- spj 步骤条 -->
        <b-col cols="12" v-show="newProblem.method">
          <el-steps :active="step" simple finish-status="success" class="br-0">
            <el-step
              v-for="(data, index) in steps"
              :key="index"
              :title="data.title"
            ></el-step>
          </el-steps>
        </b-col>
        <b-col>
          <div v-if="step == 0">
            <!-- 时空限制 -->
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
              <hr class="mb-0" />
            </b-form-group>
            <!-- 标签 -->
            <b-form-group
              label="标签"
              label-for="tag-labels"
              :state="labels_state"
            >
              <b-row>
                <b-col class="">
                  <b-form-tags
                    input-id="tag-labels"
                    v-model="label_new"
                    class=""
                    remove-on-delete
                    placeholder="添加标签，回车确定"
                    tag-pills
                    tag-variant="info"
                    :tag-validator="validateTags"
                    no-outer-focus
                    :state="labels_state"
                    add-button-text="+"
                    invalid-tag-text="无效标签"
                    separator=","
                  >
                  </b-form-tags>
                </b-col>
              </b-row>
              <template #invalid-feedback> 标签数在8个以内 </template>
              <template #description>
                <div id="tags-validation-help">
                  标签只应包含汉字,字母,数字或空格
                </div>
              </template>
            </b-form-group>
            <hr />
            <!-- spj -->
            <b-form-group v-show="newProblem.method">
              <div>
                <p class="h6">
                  <b>注意:</b>选择cpp文件,用于评测结果<br />请使用
                  <a
                    href="https://github.com/MikeMirzayanov/testlib"
                    target="_blank"
                    title=""
                    >testlib</a
                  >, 将会关闭标准流
                </p>
                <b-form-file
                  v-model="newProblem.spjFile"
                  placeholder="选择评测程序"
                  drop-placeholder=".cpp文件放入此处"
                  size="sm"
                  accept=".cpp,.cc"
                  :required="Boolean(newProblem.method) && new_checker_flag"
                  :disabled="new_checker_flag"
                >
                  <template slot="file-name" slot-scope="{ names }">
                    <b-badge variant="light" pill>checker.cpp</b-badge>
                  </template>
                </b-form-file>
                <!-- TODO 后端相应部分还没写好，先同步 -->
                <b-form-checkbox
                  v-model="new_checker_flag"
                  v-show="!label_display_none[route.name]"
                  class="mt-1"
                >
                  <h6>不修改评测程序</h6>
                </b-form-checkbox>
              </div>
              <slot name="extra"> </slot>
              <hr class="my-0" />
            </b-form-group>
            <div>
              <p class="h6 text-info">
                <b>{{ warn }}</b>
              </p>
              <div>
                <p class="h6">
                  <b>注意:</b>输入输出文件应当同名,后缀分别为<b>.in</b>和<b
                    >.out</b
                  >
                </p>
                <b-form-file
                  v-model="newProblem.inputFiles"
                  placeholder="选择输入数据"
                  multiple
                  drop-placeholder=".in文件放入此处"
                  size="sm"
                  accept=".in"
                  :required="!new_checker_flag"
                  :disabled="new_checker_flag"
                ></b-form-file>
                <b-form-file
                  v-model="newProblem.outputFiles"
                  placeholder="选择输出数据"
                  multiple
                  drop-placeholder=".out文件放入此处"
                  size="sm"
                  class="mt-2"
                  accept=".out"
                  :disabled="new_checker_flag"
                  :required="!new_checker_flag"
                ></b-form-file>
              </div>
              <!-- TODO 后端相应部分还没写好，先同步 (new_file_flag) -->
              <b-form-checkbox
                v-model="new_checker_flag"
                v-show="!label_display_none[route.name]"
                class="mt-1"
              >
                <h6>不修改文件</h6>
              </b-form-checkbox>
            </div>
            <!-- 题目类型 -->
            <b-row v-if="label_display_none[route.name] || modifyFlag">
              <b-col>
                <b-form-radio-group
                  v-model="newProblem.method"
                  :options="type_options"
                  @input="changeMethod"
                ></b-form-radio-group>
              </b-col>
            </b-row>
          </div>
          <!-- spj 第二步 -->
          <div v-else-if="step === 1">
            <b-row class="pt-2">
              <b-col>
                <p class="h5 mb-0">请提供程序以验证正确性</p>
              </b-col>
            </b-row>
            <hr />
            <b-row>
              <b-col class="h-100">
                <slot name="spj_result">
                  <p>运行结果</p>
                </slot>
              </b-col>
            </b-row>
          </div>
        </b-col>
        <!-- markdown -->
        <b-col class="border-right" lg="9">
          <markdown
            id="markdown"
            :mdPageHeight="avalHeight * heightRate"
            :Value.sync="newProblem.value"
            showMode="edit"
            :showToolBar="true"
            :editMode="this.mode"
            :problem="newProblem"
            @onSave="onMdSave"
            v-if="step == 0"
          >
          </markdown>
          <!-- 编辑器 -->
          <code-editor
            class="pl-2"
            :showIOArea="false"
            :avalHeightRate="heightRate * 0.8"
            :isEditMode="true"
            code=""
            lang="c"
            v-else-if="step == 1"
            @submit="submitTestCode"
          ></code-editor>
          <div v-else-if="step === 2">
            <p class="h4 pt-3">已完成</p>
          </div>
          <b-popover
            ref="mdPopover"
            target="markdown"
            title="注意"
            :disabled="true"
            variant="info"
          >
            此处不能为空
          </b-popover>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>
<script>
import markdown from "@/components/MdDemo"
import codeEditor from "@/components/CodeEditor"

export default {
  name: "editProblem",
  components: {
    markdown,
    "code-editor": codeEditor,
  },
  computed: {
    provLenCheck () {
      if (this.newProblem.province === undefined) return false
      return this.newProblem.province.length < 6 ? true : false
    },
    previewMode () {
      return this.step == 2
    },
    labels_state () {
      let rtn = this.label_new.length < 9 && this.label_new.length > 0 ? true : false
      if (this.label_new.length == 0) rtn = null
      return rtn
    },
    modifyFlag () {
      return this.$route.name == 'modifyProblem'
    }
  },
  created () {
    this.changeMethod(this.newProblem.method)
    this.label_new = this.newProblem.label.split(',')
  },
  data () {
    return {
      newProblem: this.oldProblem, // 为了省事直接用了，待修改
      user: {},
      warn: "",
      validate: false,
      label_new: [],
      label_display_none: {
        addCompetition: true,
        appendProblem: true,
      },
      new_file_flag: true, // TODO 后端完成后此处修改为false
      new_checker_flag: false,
      type_options: [
        { text: "常规", value: 0 },
        { text: "spj", value: 1 },
      ],
      steps: [{ title: "初始化" }, { title: "验证" }, { title: "完成" }],
      step: 0,
      submitTitleD: this.submitTitle,
    }
  },
  methods: {
    serializer () {
      let value = this.newProblem
      let form = new FormData()
      form.append("timeLimit", this.newProblem.info.limits[0].timeLimit)
      form.append("memoryLimit", this.newProblem.info.limits[0].memoryLimit)
      for (let cnt in this.newProblem.inputFiles) {
        form.append("input", this.newProblem.inputFiles[cnt])
        form.append("output", this.newProblem.outputFiles[cnt])
      }
      if (this.newProblem.method == 1)
        this.newProblem.spjFile = new File([this.newProblem.spjFile], "checker.cpp")
      form.append("spjFile", this.newProblem.spjFile)
      for (let key in value) {
        if (value[key] === null || value[key] === undefined) continue
        else if (key != "spjFile") form.append(key, value[key])
      }
      // TODO 改回 new_file_flag
      form.append('newFile', !this.new_checker_flag)
      form.append('newChecker', !this.new_checker_flag)
      return form
    },
    validateTags (tag) {
      let result = true
      let modelStr = /^[\u4e00-\u9fa5 a-zA-Z0-9]+$/
      result = modelStr.test(tag)
      result &= tag.length < 10
      return result
    },
    checkLabelsValid () {
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
    checkFilesValid () {
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
        this.warn = "输入输出文件数量不匹配"
        return false
      }
      this.warn = ""
      // this.validate = true
      return true
    },
    submitProblem () {
      if (this.step == 0) {
        if (this.labels_state) {
          // TODO 改回 new_file_flag
          if (!this.new_checker_flag)
            if (!this.checkFilesValid()) 
              return
        } else {
          this.toast("请按要求填写标签", 3000)
          return
        }
        if (this.newProblem.value === "") {
          this.$refs.mdPopover.$emit("open")
          setTimeout(() => {
            this.$refs.mdPopover.$emit("close")
          }, 5000)
          return
        }
      }
      else if (this.step == 2) {
        this.$router.replace({ 'name': 'probLib', params: { 'page': 1 } })
        return
      }
      let data = this.serializer()
      this.$emit("submit", data)
      this.$emit("update:value", this.newProblem)
    },
    onMdSave (value) {
      this.$emit("onSave", value)
    },
    changeMethod (checked) {
      if (checked) this.submitTitleD = "下一步"
      else this.submitTitleD = "提交"
    },
    submitTestCode (data) {
      this.$emit("submit_code", data)
    },
  },
  mounted () {

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
          value: "",
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
    submitTitle: {
      type: String,
      default: "提交",
    },
    heightRate: {
      type: Number,
      default: 1,
    },
    nextStep: {
      type: Number,
      default: 0,
    },
    errMsg: {
      type: String,
      default: "test",
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    nextStep (newVal) {
      if (this.step < 3) this.step = newVal
      if (this.step == 2) this.submitTitleD = '完成'
    },
    label_new () {
      this.newProblem.label = this.label_new.join(",")
    }
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
  &:disabled,
  &[readonly] {
    background-color: unset;
    border-bottom: 0;
  }
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
