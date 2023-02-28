<!--
 * @Author: 
 * @Date: 2022-01-24 19:22:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-28 09:23:15
 * @Description: 请填写简介
-->
# MyOJ_web
项目的前端，基于 `vue` 开发，实现了一些基本功能
[后端]()
[评测机]()
## 版本
```
node -v
v16.13.2
npm -v
8.1.2
```
## 安装
~~~shell
npm i
~~~

## 开发环境启动
```shell
npm run serve
```

## 部署
  请修改 `src\store\index.js`
  ```js
  let root = "http://127.0.0.1:8008" // 后端的地址
  ```
  安装依赖并运行
  ```shell
  npm run build
  ```
  将 `dist` 中文件移至 `server` 端 `deploy/nginx/html` 中

## 配置文件
* nginx 于后端 `deploy/nginx/nginx.conf`
