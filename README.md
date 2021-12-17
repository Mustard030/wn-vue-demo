# wn-vue-demo

## 安装项目依赖
```shell
npm install
```

### 启动开发服务器（开发时）
```shell
npm run serve
```

### 启动编译打包工具
```shell
npm run build
```

### 启动编译后的项目（生产环境）
```shell
# 如果没有安装静态服务器 先安装
npm install -g serve
# 运行
wn-vue-demo$ serve -s dist
```





## 项目配置

### 更换后端地址

在 wn-vue-demo > src > main.js 中有如下配置

```js
axios.defaults.baseURL = 'http://localhost:8090/'
```

### 使用Vue.prototype挂载

本项目中已默认使用`Vue.prototype.$http = axios`将axios挂载到`$http`中，调用时直接使用`this.$http`发起请求。

在代码中使用axios发起请求时，会拼接path成为完整url，如：

```js
const {data:res} = await this.$http.post(''[,params])
console.log(res)
```

> 在方法中使用await关键字请求时，方法前必须带有async修饰符，如：

```js
async post_test(){
      const {data:res} = await this.$http.post('',{'aa':1,'bb':"123"})
      console.log(res)
}
```

