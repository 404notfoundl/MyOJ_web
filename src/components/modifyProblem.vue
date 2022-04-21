<template lang="">
  <div class="container-lg">
    <div class="row py-3">
      <div class="col">
        <b-card>
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
                  <b-button
                    variant="outline-secondary"
                    squared
                    size="lg"
                    :pressed="false"
                    type="submit"
                  >
                    <p class="h6 d-inline"><b>提交</b></p>
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
                  <p class="h6">
                    <b>注意:</b>输入输出文件应当同名,后缀分别为<b>.in</b>和<b>.out</b>
                  </p>
                  <b-form-file
                    v-model="inputFiles"
                    :state="false"
                    placeholder="选择输入数据"
                    multiple
                    drop-placeholder=".in文件放入此处"
                    size="sm"
                    required
                    accept=".in"
                  ></b-form-file>
                  <b-form-file
                    v-model="outputFiles"
                    :state="false"
                    placeholder="选择输出数据"
                    multiple
                    drop-placeholder=".out文件放入此处"
                    size="sm"
                    required
                    class="mt-2"
                    accept=".out"
                  ></b-form-file>
                </div>
              </b-col>
              <!-- markdown -->
              <b-col class="px-0 border-right" lg="9">
                <markdown
                  id="markdown"
                  :mdPageHeight="avalHeight"
                  :Value.sync="newProblem.value"
                  showMode="edit"
                  :showToolBar="true"
                  :editMode="this.mode"
                  :problem="newProblem"
                >
                </markdown>
                <b-popover ref="mdPopover" target="markdown" title="密码要求" :disabled="true">
                  此处不能为空
                </b-popover>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
import markdown from "@/components/MdDemo"

export default {
  name: "problemModification",
  beforeRouteEnter(to, from, next) {
    if (to.name === "modifyProblem" && to.params.oldProblem === undefined) {
      next({ name: "probLib" })
    } else next()
  },
  components: {
    markdown,
  },
  computed: {
    avalHeight: {
      get: function () {
        return this.$store.state.avaliableHeight
      },
    },
  },
  created() {
    let md = this.getLocalJson("markdown")
    if (md !== null)
      if (md["append"] !== undefined && this.oldProblem.title === "") {
        // md['append'].value = md['append'].value
        this.newProblem = md["append"]
      }
    this.label_old = this.oldProblem.label
  },
  data() {
    return {
      newProblem: this.oldProblem,
      user: {},
      inputFiles: null,
      outputFiles: null,
      warn: "",
      validate: false,
      label_old: "",
    }
  },
  methods: {
    serializer() {
      let value = this.newProblem
      value["label_old"] = this.label_old
      // value.timeLimit = this.newProblem.info.limits[0].timeLimit
      // value.memoryLimit = this.newProblem.info.limits[0].memoryLimit
      // let files = this.inputFiles.concat(this.outputFiles)
      let form = new FormData()
      form.append("timeLimit", this.newProblem.info.limits[0].timeLimit)
      form.append("memoryLimit", this.newProblem.info.limits[0].memoryLimit)
      for (let cnt in this.inputFiles) {
        form.append("input", this.inputFiles[cnt])
        form.append("output", this.outputFiles[cnt])
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
      // this.validate = false
      if (this.inputFiles === null || this.outputFiles === null) return
      let map = {}
      let inputLength = 0,
        outputLength = 0
      for (let ind = 0; ind < this.inputFiles.length; ind++) {
        let item = this.inputFiles[ind]
        let str = item.name.split(".")[0]
        map[str] = true
        inputLength++
      }
      for (let ind = 0; ind < this.outputFiles.length; ind++) {
        let item = this.outputFiles[ind]
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
        if (!this.checkFilesValid()) return
      } else return

      if (this.newProblem.value === "") {
        this.$refs.mdPopover.$emit("open")
        setTimeout(() => {
          this.$refs.mdPopover.$emit("close")
        }, 5000)
        return
      }
      // if (!this.validate) return
      let method = "POST"
      let url = `${this.$store.state.webUrl.save}`
      if (this.$route.params.pid !== undefined) {
        method = "PUT"
        url += `${this.$route.params.pid}/`
      }
      let data = this.serializer()
      let info = this.getUserInfo()
      // data = this.$qs.stringify(data)
      // debugger
      this.$axios({
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
        .then((response) => {
          // debugger
          console.log("success")
          this.$router.replace({ name: "probLib" })
        })
        .catch((err) => {
          // debugger
          console.log(err)
        })

      // console.log("accept")
    },
    getProblemDetail() {},
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
        }
      },
    },
    mode: {
      type: String,
      default: "modify",
    },
    //后期要改，防止忘记
    usrInfo: {
      type: Object,
      default: () => {
        return {}
      },
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
