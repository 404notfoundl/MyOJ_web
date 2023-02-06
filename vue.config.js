/*
 * @Author:
 * @Date: 2022-01-24 19:22:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-08 11:00:11
 * @Description: 请填写简介
 */
//引入

module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
      productionSourceMap: false
    },
  },
  lintOnSave: false,
  chainWebpack: (config) => {

    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        // 修改它的选项...
        options = {
          transformAssetUrls: {
            video: ["src", "poster"],
            source: "src",
            img: "src",
            image: "xlink:href",
            // 在这里添加需要使用静态资源的自定义元素
            "b-avatar": "src",
          },
        }
        return options
      })
  },
}
