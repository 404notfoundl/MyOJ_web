<template lang="">
  <div class="container-lg">
    <div class="row py-3">
      <div class="col">
        <b-card class="border-0">
          <edit-page @submit="submitProblem" :oldProblem="oldProblem" :mode="mode"></edit-page>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
import editPage from "./editProblemPage"

export default {
  name: "problemModification",
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
    // avalHeight: {
    //   get: function () {
    //     return this.$store.state.avaliableHeight
    //   },
    // },
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
    submitProblem(data) {
      let method = "POST"
      let url = `${this.$store.state.webUrl.save}`
      if (this.$route.params.pid !== undefined) {
        method = "PUT"
        url += `${this.$route.params.pid}/`
      }
      if (data.get("prov_comp_flag")[0]==="t") {
        url = `${this.$store.state.webUrl.provincial_competition.self}/`
      }
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
          // debugger
          this.toast(response.data.result)
          this.$router.replace({ name: "probLib" })
        })
        .catch((err) => {
          debugger
          this.toast(err.response.data.result)
        })
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
          prov_comp_flag: false,
        }
      },
    },
    mode: {
      type: String,
      default: "modify",
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
