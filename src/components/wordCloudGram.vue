<!--
 * @Author: 
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-07 10:20:26
 * @Description: 请填写简介
-->
<template >
  <div class="h-auto w-auto">
    <ve-wordcloud
      :data="data"
      width="100%"
      :height="gramHeight"
      :settings="chartSettings"
      class="z-4"
    ></ve-wordcloud>
  </div>
</template>
<script>
export default {
  props: {
    gramHeight: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    gramShape: {
      type: String,
      default: 'cardioid',
    },
  },
  data() {
    this.chartSettings = {
      shape: this.gramShape,
    }
    return {}
  },
  methods: {
  },
  mounted() {},
}
</script>
<style lang=""></style>
