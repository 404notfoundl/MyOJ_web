module.exports = {
  pages: {
    index: {
      entry: 'src/main.js'
    }
  },
  lintOnSave: false,
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
        .tap(options => {
          // 修改它的选项...
          options={
            transformAssetUrls: {
              video: ['src', 'poster'],
              source: 'src',
              img: 'src',
              image: 'xlink:href',
              // 在这里添加需要使用静态资源的自定义元素
              'b-avatar': 'src',
             }
          }
          return options
        })
  }

}
