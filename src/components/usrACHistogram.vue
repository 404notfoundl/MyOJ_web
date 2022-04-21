<template lang="">
  <div class="w-auto h-auto">
    <ve-histogram :xAxis="xAxis" :series="series"> </ve-histogram>
  </div>
</template>
<script>
export default {
  computed: {
    xAxis: function () {
      return [
        {
          type: 'category',
          data: this.xAxisName,
          name: '日期',
        },
      ]
    },
    series: function () {
      return [
        {
          name: 'AC数',
          type: 'bar',
          barWidth: '20%',
          barMaxWidth: '40px',
          data: this.value,
        },
      ]
    },
  },
  data() {
    return {
      xAxisName: [],
      value: [],
    }
  },
  mounted() {
    this.xAxisName = ['1/1', '1/2', '1/3', '1/4', '1/5', '1/6']
    this.value = [1, 2, 3, 4, 5, 6]
  },
}
</script>
<style lang=""></style>
