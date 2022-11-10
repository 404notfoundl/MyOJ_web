<!--
 * @Author: 
 * @Date: 2022-01-24 19:22:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-08 21:02:15
 * @Description: 请填写简介
-->
# oj_demo_server
项目的前端
## 配置
需要修改以下选项
`./src/store/index.js`
```javascript
let root = "http://127.0.0.1:8000" // 后端的地址
```
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

## 更新
将打包后的`dist`文件夹压缩为`front_end.tar`
放入`server`容器`/home`后
```shell
sh cp_front_end.sh
```

## 启动
位于server容器中时
```shell
nginx
```
## 修改nginx
nginx 目录
```
/usr/local/nginx/conf/nginx.conf
```