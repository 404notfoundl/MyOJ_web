<!--
 * @Author: 
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: 
 * @LastEditTime: 2022-08-01 10:50:57
 * @Description: 请填写简介
-->
<template lang="">
  <div class="h-auto w-auto">
    <ve-wordcloud
      :data="data"
      width="100%"
      :height="gramHeight"
      :settings="chartSettings"
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
