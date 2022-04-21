<template>
  <div class="overflow-hidden position-relative" :style="`max-height:${maxHeight}`">
    <div class="fold fix-bottom w-100 z-3" @click="unFold" v-show="isHide">
      <!-- 展开按钮 -->
      <b-button
        block
        variant="outline-secondary"
        squared
        size="lg"
        class="border-0"
        :pressed="false"
      >
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
    </div>
    <!-- 展开栏 -->
    <b-row class="w-100 fix-bottom z-0">
      <b-col> </b-col>
    </b-row>
    <div class="" ref="mdComp">
      <markdown
        class="border-bottom border-top"
        :Value="info.value"
        showMode="preview"
        :mdPageHeight="Number.parseInt(innerMaxHeight)"
        :showToolBar="showToolBar"
      >
        <!-- <template #left-before>
          <div class="d-inline-block">
            <b-link
              :to="{ name: 'usrInfo', params: { uid: info.uid } }"
              class="text-decoration-none"
            >
              <p class="text-left px-2 h5">
                <b>{{ info.username }}</b>
              </p>
            </b-link>
          </div>
        </template> -->
      </markdown>
    </div>
    <!-- <b-card no-body class="">
      <b-card-body> </b-card-body>
    </b-card> -->
  </div>
</template>
<script>
import markdown from "@/components/MdDemo"
export default {
  name: "solution",
  components: {
    markdown,
  },
  computed: {
    isHide() {
      return this.maxHeight !== "unset"
    },
  },
  data: function () {
    return {
      maxHeight: this.innerMaxHeight,
    }
  },
  methods: {
    unFold() {
      this.maxHeight = "unset"
    },
  },
  mounted() {},
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          username: "",
          value: "",
          uid: 1,
        }
      },
    },
    innerMaxHeight: {
      type: String,
      default: "600px",
    },
    showToolBar: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
// .fill-t,
// .fill-y,
// .fill {
//   margin-top: -20px;
// }

// .fill-b,
// .fill-y,
// .fill {
//   margin-bottom: -20px;
// }

// .fill-l,
// .fill-x,
// .fill {
//   margin-left: -20px;
// }

// .fill-r,
// .fill-x,
// .fill {
//   margin-right: -20px;
// }

.fix-bottom {
  position: absolute;
  bottom: 0;
}

.fold {
  opacity: 70%;
  background-color: white;
}
</style>
