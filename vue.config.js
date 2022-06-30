/*
 * @Author:
 * @Date: 2022-01-24 19:22:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-29 19:32:03
 * @Description: 请填写简介
 */
//引入

module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
    },
  },
  lintOnSave: false,
  chainWebpack: (config) => {
    // const CompressionWebpackPlugin = require("compression-webpack-plugin")
    // if (process.env.NODE_ENV === "production") {
    //   config.plugin("CompressionPlugin").use(
    //     new CompressionWebpackPlugin({
    //       test: /\.(js|css)$/,
    //       threshold: 10240, // 超过10kb的文件就压缩
    //       deleteOriginalAssets: true, // 不删除源文件
    //       minRatio: 0.8,
    //     })
    //   )
    // }

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
