<!--
 * @Author: 
 * @Date: 2022-01-24 19:22:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-06 15:33:04
 * @Description: 请填写简介
-->
# MyOJ_web
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
## 部署
需要修改以下选项
`src/store/index.js`
```javascript
let root = "http://localhost:8000" // 后端的地址
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