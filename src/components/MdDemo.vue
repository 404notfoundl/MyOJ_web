<template>
  <div class="w-100">
    <mavon-editor
      v-model="value"
      :defaultOpen="showMode"
      @fullScreen="handleFullScreen"
      :style="`height:auto;z-index:${z_index_param};min-height:${editHeight};border:none;`"
      :subfield="isEdit"
      :toolbars="toolbar"
      :shortCut="isEdit"
      @save="saveMarkdown()"
      :boxShadow="false"
      :toolbarsFlag="showToolBar"
      previewBackground="#ffffff"
      toolbarsBackground="#fcfcfc"
      placeholder="右上角(F9)可以预览"
      @change="returnDebounce()"
    >
      <!-- 工具栏修改 -->
      <template slot="left-toolbar-before">
        <slot name="left-before"></slot>
        <!-- <a :href="usrUrl" class="pl-2" v-if="!isEdit">{{ usrName }}</a> -->
      </template>
      <template slot="left-toolbar-after">
        <slot name="left-after"></slot>
      </template>
      <template slot="right-toolbar-before">
        <slot name="right-before"></slot>
      </template>
      <template slot="right-toolbar-after">
        <slot name="right-after"></slot>
      </template>
    </mavon-editor>
  </div>
</template>
<script>
export default {
  name: "MarkdownEditor",

  computed: {
    isEdit: function () {
      return this.showMode !== "preview"
    },
    editHeight: {
      get: function () {
        return this.mdHeight
      },
      set: function (newval) {
        this.mdHeight = newval
      },
    },
  },
  created() {
    //读取本地存储
    let solution = this.getLocalJson("markdown")
    if (solution !== null && this.isEdit && this.Value === "") {
      // debugger
      if (solution[`${this.editMode}`] === undefined || solution[`${this.editMode}`] === null);
      else {
        /*solution[`${this.editMode}`] = {}*/
        solution = solution[`${this.editMode}`]
        // debugger
        //编辑器或是添加题目
        if (this.$route.params.pid === undefined) {
          if (solution !== undefined) this.value = solution.value
        } else {
          //题解的情况
          if (solution[`${this.$route.params.pid}`] !== undefined)
            this.value = solution[`${this.$route.params.pid}`].value
        }
      }
    }
    this.toolbar = this.isEdit
      ? {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          //imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          // readmodel: true, // 沉浸式阅读
          // htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          // trash: true, // 清空
          save: this.editMode === "modify" ? false : true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
        }
      : {
          navigation: true, // 导航目录
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          save: true, // 保存（触发events中的save事件）
        }
    //保存防抖
    this.saveMarkdown = this.ojDebounce(this.onSaveMdListener, 500)
    //返回文本防抖
    this.returnValue = false
    this.returnDebounce = this.ojDebounce(this.returnToFather, 200)
  },
  data() {
    return {
      saveMarkdown: null, //保存事件
      closeOpt: false,
      mdHeight: Math.ceil(this.mdPageHeight * 0.8) + "px",
      z_index_param: 1010,
      value: this.Value,
      toolbar: null,
      returnDebounce: null,
      returnValue: false,
    }
  },
  methods: {
    /**
     * @description: 返回给父节点(.sync即可类似双向绑定)
     * @param {*} value markdown的值
     * @return {*} value
     */
    returnToFather() {
      //暂时这样
      if (this.showMode !== "preview") {
        this.$emit("update:value", this.value) //这是传回给Value的
        console.log("return2father")
      }
    },
    handleFullScreen(bFull) {
      // console.log('called')
      if (bFull) {
        this.editHeight = "100%"
        this.z_index_param = 1070
      } else {
        this.editHeight = Math.ceil(this.mdPageHeight * 0.8) + "px"
        this.z_index_param = 1010
      }
    },
    downLoadDataToLoc(saveDatas) {
      // 创建一个blob的对象，把Json转化为字符串作为我们的值
      var blob = new Blob([saveDatas])
      if ("msSaveOrOpenBlob" in navigator) {
        // 这个判断要不要都行，如果是IE浏览器，使用的是这个，
        window.navigator.msSaveOrOpenBlob(blob, "results.txt")
      } else {
        // 不是IE浏览器使用的下面的
        var url = window.URL.createObjectURL(blob)
        // 上面这个是创建一个blob的对象连链接，
        var link = document.createElement("a")
        // 创建一个链接元素，是属于 a 标签的链接元素，所以括号里才是a，

        link.href = url
        // 把上面获得的blob的对象链接赋值给新创建的这个 a 链接
        link.setAttribute("download", "unnamed.md")
        // 设置下载的属性（所以使用的是download），这个是a 标签的一个属性
        // 后面的是文件名字，可以更改
        link.click()
        // 使用js点击这个链接
      }
    },
    //预览模式保存至本地，编辑模式保存至浏览器
    onSaveMdListener() {
      if (this.value == "") return
      let text = ""
      if (!this.isEdit) {
        this.downLoadDataToLoc(this.value)
        text = "已保存至本地存储"
      } else {
        let solutions = this.getLocalJson("markdown")
        if (solutions === null) solutions = {}
        if (solutions[`${this.editMode}`] === undefined || solutions[`${this.editMode}`] === null)
          solutions[`${this.editMode}`] = {}

        let solution = solutions[`${this.editMode}`]
        //储存题解
        if (this.$route.params.pid !== undefined && this.$route.params.pid !== null) {
          if (solution[`${this.$route.params.pid}`] === undefined)
            solution[`${this.$route.params.pid}`] = {}
          solution[`${this.$route.params.pid}`].value = this.value
        } else {
          // if (solution['editor'] === undefined) solution['editor'] = {}
          //添加编辑器,题目的储存
          let obj = null
          if (this.$attrs.problem !== undefined) {
            obj = this.$attrs.problem
            obj.value = this.value
          } else {
            obj = {}
            obj.value = this.value
          }
          solutions[`${this.editMode}`] = obj
          // solution['editor'].value = this.value
        }
        this.setLocalJson("markdown", solutions)
        text = "已保存至浏览器"
      }
      // this.$emit("test")
      this.$bvToast.toast(text, {
        title: "成功",
        variant: "info",
        autoHideDelay: 3000,
      })
    },
  },
  mounted: function () {},
  props: {
    editMode: {
      type: String,
      default: "solution",
    },
    showToolBar: {
      type: Boolean,
      default: true,
    },
    mdPageHeight: {
      type: Number,
      default: window.innerHeight,
    },
    usrUrl: {
      type: String,
      default: "#top",
    },
    showMode: {
      type: String,
      default: "edit",
    },
    usrName: {
      type: String,
      default: "usr",
    },
    Value: {
      type: String,
      default: "",
    },
  },
  watch: {
    mdPageHeight: function () {
      this.editHeight = Math.ceil(this.mdPageHeight * 0.8) + "px"
    },
    Value: function () {
      this.value = this.Value
    },
  },
}
</script>
<style scoped>
.lang-input {
  user-select: all !important;
}
</style>
