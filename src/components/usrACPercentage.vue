<!--
 * @Author: 
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-09 20:00:37
 * @Description: 请填写简介
-->
<template lang="">
  <div class="w-auto h-auto">
    <ve-liquidfill :data="liquidFillChartData" :settings="chartSettings"></ve-liquidfill>
  </div>
</template>
<script>
export default {
  name: "percentChart",
  computed: {
    acPercentage: function () {
      return [
        {
          accept: "AC",
          percent: this.accept_num / this.submit_num,
        },
      ]
    },
    liquidFillChartData() {
      return {
        columns: ["accept", "percent"],
        rows: this.acPercentage,
      }
    },
  },
  data() {
    this.chartSettings = {
      seriesMap: {
        AC: {
          shape: "circle",
          label: {
            formatter(options) {
              const { seriesName, value } = options
              return `${seriesName}率\n${window.isNaN(value) ? "-" : Math.round(value * 100)}%`
            },
            fontSize: 32,
            color: "#ec583a",
            insideColor: "white",
          },
          color: ["#9ad3de"],
          outline: {
            show: false,
          },
        },
      },
    }
    return {
      // liquidFillChartData: {
      //   columns: ["accept", "percent"],
      //   rows: [],
      // },
    }
  },
  props: {
    accept_num: {
      type: Number,
      required: true,
    },
    submit_num: {
      type: Number,
      required: true,
    },
  },
}
</script>
<style lang=""></style>
