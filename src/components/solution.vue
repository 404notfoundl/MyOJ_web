<template>
  <div
    class="overflow-hidden position-relative"
    :style="`max-height:${maxHeight}`"
  >
    <!-- 载入等待 -->
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <b-skeleton
          v-for="(item, index) in Math.ceil(Math.random() * 30) + 5"
          :width="Math.ceil(Math.random() * 70) + '%'"
          :key="index"
        ></b-skeleton>
      </template>
      <!-- 展开栏 -->
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
            class="bi bi-chevron-double-down d-inline"
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
          <p class="h6 d-inline">展开</p>
        </b-button>
      </div>
      <div class="" ref="mdComp">
        <markdown
          class="border-bottom border-top"
          :Value="info.value"
          showMode="preview"
          :mdPageHeight="Number.parseInt(innerMaxHeight)"
          :showToolBar="showToolBar"
        >
        </markdown>
      </div>
    </b-skeleton-wrapper>
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
    isHide () {
      return this.maxHeight !== "unset"
    },
  },
  data: function () {
    return {
      maxHeight: this.innerMaxHeight,
    }
  },
  methods: {
    unFold () {
      this.maxHeight = "unset"
    },
  },
  mounted () { },
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
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.fix-bottom {
  position: absolute;
  bottom: 0;
}

.fold {
  background-color: white;
}
</style>
