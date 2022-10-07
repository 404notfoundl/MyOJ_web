/*
 * @Author: 
 * @Date: 2022-01-24 19:22:40
 * @LastEditors: 
 * @LastEditTime: 2022-08-27 10:25:28
 * @Description: 请填写简介
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ["@babel/preset-env", { "modules": false }]
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
