<template>
  <div class="w-100" ref="editor_div" :style="`height:${avalHeight - 17}px;`">
    <!-- 编辑器主体 -->
    <div :class="'row h-' + heightRate">
      <div class="col-12 px-0 py-0 h-100">
        <div class="ace-container h-100 position-relative">
          <!-- 右下部分 -->
          <div class="h-auto col-2 bottom-right-relative z-0" v-if="isEditMode">
            <div class="row justify-content-center">
              <div class="col-12">
                <b-form-select
                  v-model="usrLanguage"
                  class="mb-3"
                  :state="usrLanguage ? true : false"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled> 选择语言 </b-form-select-option>
                  </template>
                  <b-form-select-option
                    v-for="(path, name, index) in languagePath"
                    :key="index"
                    :value="name"
                    >{{ name }}</b-form-select-option
                  >
                </b-form-select>
              </div>
            </div>
            <div class="row px-1 justify-content-center">
              <b-button
                variant="outline-dark"
                @click="submitUsrCode"
                size="sm"
                v-b-popover.hover.left="checkEditorValidity"
                title=""
                :disabled="submitting"
                >提交</b-button
              >
              <!-- submitting -->
            </div>
          </div>
          <!-- 官方文档中使用 id，这里禁止使用，在后期打包后容易出现问题，使用 ref 或者 DOM 就行 -->
          <div class="ace-editor h-100 touch-action" ref="ace"></div>
        </div>
      </div>
    </div>
    <!-- 分割线 -->
    <div class="row">
      <hr class="py-0 my-0 w-100" />
    </div>
    <!-- 输入输出部分 -->
    <div v-if="isEditMode && showIOArea" class="h-25">
      <div class="row h-100">
        <div class="col-6 px-0 h-100 border-right">
          <textarea
            class="h-100 w-100 px-2 pt-1 border-0"
            placeholder="输入数据"
            v-model.lazy="ioArea.input"
          ></textarea>
        </div>
        <div class="col-6 px-0 h-100">
          <div class="h-100 w-100 px-2 pt-1 border-0 bg-white text-center" v-if="loading">
            <b-spinner  variant="primary" label="Loading..."></b-spinner>
          </div>
          <textarea
            class="h-100 w-100 px-2 pt-1 border-0"
            placeholder="输出数据"
            v-model="output"
            readonly
            v-else
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ace from "ace-builds"
import "ace-builds/webpack-resolver" // 在 webpack 环境中使用必须要导入
import "ace-builds/src-min-noconflict/ext-language_tools"
import "ace-builds/src-min-noconflict/ext-emmet"
// import { nanoid } from "nanoid"

require("ace-builds/webpack-resolver")
export default {
  name: "CodeEditor",
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
    // if (this.$refs.ioArea)
    this.$refs.ace.removeEventListener("mousewheel", this.editorScollerListener)
  },
  computed: {
    heightRate: function () {
      let rate = 100
      if (this.isEditMode && this.showIOArea) rate = 75
      return rate
    },
    avalHeight: function () {
      // debugger
      return this.$store.state.avaliableHeight * this.avalHeightRate
    },
  },
  created() {
    // debugger
    if (!this.isAuthed) {
      this.$router.push({ name: "login" })
    }
    //不显示返回顶部
    this.$store.commit("setTopState", true)
    //获取本地储存的代码
    let localCode = this.getLocalJson("usrCode")
    // debugger
    if (this.code == null && this.lang == null) {
      let pid = this.$route.params.pid
      if (pid == undefined) pid = "editor"
      if (localCode !== null && localCode[`${pid}`] !== undefined) {
        this.usrLanguage = localCode[`${pid}`].language
        this.usrCode = localCode[`${pid}`].code
      } else {
        this.usrCode = ""
        this.usrLanguage = "c"
      }
    }
    // debugger
  },
  data() {
    return {
      aceEditor: null,
      usrCode: this.code,
      usrLanguage: this.lang,
      ioArea: {
        input: "",
      },
      alertText: "",
      themePath: {
        //主题
        // 不导入 webpack-resolver，该模块路径会报错
        github: "ace/theme/github",
        monika: "ace/theme/monokai",
        sqlserver: "ace/theme/sqlserver",
      },
      languagePath: {
        //语言,注释的部分评测机里还没写好
        c: "ace/mode/c_cpp",
        // csharp: "ace/mode/csharp", //
        cpp11: "ace/mode/c_cpp",
        // java: "ace/mode/java", //
        // javascript: "ace/mode/javascript", //
      },
      O2: true,
      submitting: false,
      loading: false,
    }
  },
  methods: {
    checkEditorValidity() {
      let alertText = ""
      if (this.aceEditor) this.usrCode = this.aceEditor.getValue()
      if (this.usrLanguage !== null && this.usrCode !== "") {
        alertText = "√"
        return alertText
      } else {
        if (this.usrLanguage == null) alertText = "请选择语言"
        else alertText = "请输入代码"
        return alertText
      }
    },
    saveUsrCode() {
      //此处有待修改
      this.usrCode = this.aceEditor.getValue()
      let usrC = this.getLocalJson("usrCode")
      let pid = this.$route.params.pid
      if (usrC === null) usrC = {}
      if (pid === undefined) pid = "editor"
      usrC[`${pid}`] = { language: this.usrLanguage, code: this.usrCode }
      this.setLocalJson("usrCode", usrC)
    },
    setEditorHeight() {
      this.$refs.ace.style.height = "400px"
      this.aceEditor.resize()
    },
    submitUsrCode() {
      if (this.checkEditorValidity() !== "√") {
        return false
      }
      // 15K
      if (this.usrCode.length > 10240) {
        this.toast("代码过长")
        return false
      } else if (this.showIOArea) {
        if (this.ioArea.input.length > 10240) {
          this.toast("输入数据过长")
          return false
        } else if (this.ioArea.input.length == 0) {
          this.toast("输入数据过短")
          return false
        }
      }
      let data = {
        code: this.usrCode,
        lang: this.usrLanguage,
        O2: this.O2,
      }
      //编辑器的输入数据
      if (this.ioArea.input !== "") data.input = this.ioArea.input
      this.loading = true
      this.$emit("submit", data)
      return
    },
    editorScollerListener(event) {
      let editorDom = this.$refs.ace
      if (event.ctrlKey === true || event.metaKey) {
        let fontSize = parseInt(editorDom.style.fontSize)
        if (event.deltaY < 0) {
          if (fontSize < 80) {
            fontSize += 4
            editorDom.style.fontSize = fontSize + "px"
          }
        } else if (event.deltaY > 0) {
          if (fontSize > 12) {
            fontSize -= 4
            editorDom.style.fontSize = fontSize + "px"
          }
        }
        this.aceEditor.resize()
        this.aceEditor.renderer.updateFull()
        // event.preventDefault()
      }
    },
  },
  mounted() {
    this.aceEditor = ace.edit(this.$refs.ace, {
      // maxLines: 40, // 最大行数，超过会自动出现滚动条
      // minLines: 40, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: "16px", // 编辑器内字体大小
      theme: this.themePath.sqlserver, // 默认设置的主题
      mode: this.languagePath[this.usrLanguage], // 默认设置的语言模式
      tabSize: 4, // 制表符设置为 4 个空格大小
      readOnly: !this.isEditMode,
      value: this.usrCode,
    })
    this.aceEditor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      // enableEmmet: true,
      wrap: true,
      enableEmmet: true,
      newLineMode: "unix",
      readOnly: !this.isEditMode,
      // setShowPrintMargin: false,
    })
    //监听ctrl+滚轮，缩放字体大小
    this.$refs.ace.addEventListener("mousewheel", this.editorScollerListener, {
      passive: false,
    })
    //保存输入代码
    if (this.isEditMode) this.aceEditor.on("blur", this.saveUsrCode)
  },
  props: {
    avalHeightRate: {
      type: Number,
      default: 1,
    },
    isEditMode: {
      type: Boolean,
      default: true,
    },
    showIOArea: {
      type: Boolean,
      default: true,
    },
    code: {
      type: String,
      default: null,
    },
    lang: {
      type: String,
      default: null,
    },
    output: {
      type: String,
      default: "",
    },
  },
  updated() {
    this.aceEditor.resize()
    // debugger
  },
  watch: {
    usrLanguage: function () {
      this.aceEditor.session.setMode(this.languagePath[this.usrLanguage])
      this.aceEditor.focus()
    },
    output: function () {
      this.loading = false
    },
  },
}
</script>
<style scoped lang="scss">
.editor {
  min-height: 100%;
  min-width: 100%;
}

.hidden-scorller {
  overflow: hidden;
}

.bg-black {
  background-color: black;
}

.bottom-right-relative {
  position: absolute;
  right: 4%;
  bottom: 4%;
}

.touch-action {
  touch-action: none !important;
}

@media (max-width: 800px) {
  .bottom-right-relative {
    min-width: 120px;
  }
}

hr {
  border: 5px solid #aaa;
  opacity: 75%;
}
</style>
