/*
 * @Author: 
 * @Date: 2022-01-24 19:31:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-28 08:49:34
 * @Description: 请填写简介
 */
Date.prototype.format = function (fmt) {
  let ret;
  const opt = {
    "y+": this.getFullYear().toString(),        // 年
    "M+": (this.getMonth() + 1).toString(),     // 月
    "d+": this.getDate().toString(),            // 日
    "H+": this.getHours().toString(),           // 时
    "m+": this.getMinutes().toString(),         // 分
    "S+": this.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    }
  }
  return fmt;
}