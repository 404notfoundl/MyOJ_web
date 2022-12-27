<!--
 * @Author: 
 * @Date: 2022-01-24 19:22:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-11 15:50:07
 * @Description: 请填写简介
-->
# oj_demo_web
项目的前端，基于 `vue` 开发
[后端]()
[评测机]()
## 版本
```
node -v
v16.13.2
npm -v
8.1.2
```
## 安装 | 运行 | 打包
```
npm install
npm run serve
npm run build
```
## 部署
需要修改以下选项
`./src/store/index.js`
```javascript
let root = "http://127.0.0.1:8000" // 后端的地址
```
* 从 `server` 部署
  请参考 `server` 部分
* 单独部署
  1. 修改nginx配置
      ```
      deploy/nginx/nginx.conf
      ```
      需要修改uwsgi转发的地址
  2. 部署
      ```shell
      npm i
      npm run build
      cd deploy
      docker-compose up -d
      ```