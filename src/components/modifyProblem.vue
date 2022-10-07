<template lang="">
  <div class="container-lg">
    <div class="row py-3">
      <div class="col">
        <b-card class="border-0">
          <edit-page
            @submit="submitProblem"
            :oldProblem="newProblem"
            :mode="mode"
            @onSave="onMdSave"
            :key="oldProblem.pid"
          ></edit-page>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
import editPage from "./editProblemPage"

export default {
  name: "modifyProblem",
  beforeRouteEnter(to, from, next) {
    // 修改题目但没有原题数据时
    if (to.name === "modifyProblem" && to.params.oldProblem === undefined) {
      next({ name: "probLib" })
    } else next()
  },
  components: {
    "edit-page": editPage,
  },
  computed: {
    routeName() {
      return this.$route.name
    },
  },
  created() {
    this.load()
  },
  data() {
    return {
      newProblem: null,
    }
  },
  methods: {
    submitProblem(data) {
      let method = "POST"
      let url = `${this.$store.state.webUrl.save}`
      if (this.$route.params.pid !== undefined) {
        method = "PUT"
        url += `${this.$route.params.pid}/`
      }
      // if (data.get("prov_comp_flag")[0] === "t") {
      //   url = `${this.$store.state.webUrl.provincial_competition.self}/`
      // }
      // debugger
      // let data = this.serializer()
      let info = this.userInfo
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
          // this.toast(response.data.result)
          this.$router.replace({ name: "probLib", params: { page: 1 } })
        })
        .catch((err) => {
          debugger
          this.toast(err.response.data.result)
        })
    },
    onMdSave(value) {
      this.save(value)
    },
    save(value) {
      if (value !== null && value !== undefined) this.newProblem.value = value
      this.saveMdBorwser("add", "temporary", this.newProblem)
    },
    load() {
      if (this.oldProblem.pid !== null) this.newProblem = this.oldProblem
      else this.newProblem = this.getMdBorwser("add", "temporary")
      if (this.newProblem == null) this.newProblem = this.oldProblem
    },
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
          spjFlag: false,
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
    routeName() {
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
</style>
