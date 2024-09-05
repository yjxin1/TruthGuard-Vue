# 相关技术
- 基础框架：Vue3+ElementPlus
- 状态管理：pinia
- 路由组件：vue-router
- 网络请求：axios
- 富文本编辑器：tinymce
- 其他技术：详见前端项目的package.json

# 部署
使用VScode部署项目，使用终端命令行npm istall下载包。
在vite.config.ts里设置请求后端服务器的请求地址。例如，host表示监听所有的IP地址，使得可以通过服务器的IP地址访问，将所有以 '/api' 开头的请求代理到后端的地址，将所有以 '/image' 开头的请求代理到后端的地址。
``` ts
server: {
    host:'0.0.0.0',
    port:5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，去掉 /api 前缀
      },
      '/image': {  // 添加对图片路径的转发规则
        target: 'http://localhost:8081/',
        changeOrigin: true,
      },
    },
  },
```

# public：
存放了与业务逻辑无关的静态资源。icons、langs、models、plugins、skins、themes这6个文件是富文本编辑器tinymce的静态资源。favicon2.ico是本项目的图标。

# src文件介绍
## main.ts
```ts
app.use(createPinia())
app.use(router)
app.use(ElementPlus,{  //ElementPlus语言为中文
    locale:zhCn,
    size:'default',
})
```
## type.ts
定义了本系统要用到的实体类型
```ts
// 定义 Article 接口
export interface Article {
  id: number | null;
  title: string | null;
  rumorText: string | null;
  debunkText: string | null;
  publisher: string | null;
  publishTime: Date | null;
  summary: string | null;
  crawlSource: number | null; //1-本系统，2-中互，3-较真，4-果壳
  verificationLevel: number | null;  //鉴定级别，10为真，5为半真半假，0为假
  crawlUrl: string | null; //文章链接
  status:number|null;   //上架状态：1上架，0未上架
}

//定义Clue接口
  export interface Clue {
    id: number| null;
    link: string| null;
    title: string| null;
    content: string| null;
    submitTime:Date| null;
    phone:string|null;
    field:string|null;
  }
  //定义UserInfo
  export interface UserInfo {
    id:number| null,
    nick:string| null,
    phone:string| null,
    password:string| null,
    gender:string| null,
    age:number| null,
    type:number| null,  //1读者，2核查员，3管理员
  }
   //定义Question
   export interface Question {
    id:number| null,
    questionText:string| null,
    answer:number| null,
    answerSource:string| null,
    cover:string| null,
  }
```
## assets
用于存放应用程序使用的静态资源文件，例如图片、样式表等。暂不做修改。
## views
LoginView.vue：登录界面
ReaderView.vue: 读者界面入口
RearView.vue：管理员界面入口
## components
用于存放应用程序的公共组件
icons文件夹暂无用处
personal文件夹存放展示用户个人信息的vue组件包括index.vue, ChangePsw.vue, Profile.vue
Reader文件夹，当通过ReaderView.vue进入读者界面，会有不同的功能菜单，每个功能菜单相对应Reader下面的vue组件。
components下其他的vue组件，都是通过RearView.vue进入管理员界面，每个功能菜单相对应的。
## request
在request.ts里设置了请求拦截器和响应拦截器，请求拦截把所有的请求的请求头添加了token。响应拦截把异常时的错误信息处理。
在api文件夹里，articleApi.ts, clueApi.ts,loginApi.ts, questionApi.ts, userApi.ts, 分别定义了不同模块要用到的请求api，与后端接口相对应。
## router
定义了路由的跳转逻辑，并设置了路由守卫，如果用户未验证，重定向到登陆页面。
## store
用于管理应用程序的状态。本项目使用Pinia，存储登录用户的信息，并在本地会话中存入token，方便在request.ts中的请求拦截器设置请求头携带token访问后端资源。
```ts
//store/index.ts
import type { UserInfo } from '@/types';
import { defineStore } from 'pinia';
export const useInfoStore = defineStore('info', {
    state: () => ({
        token: '',
        userInfo: JSON.parse(sessionStorage.getItem("userInfo") || "{}") as UserInfo  //从sessionStorage读取
    }),
    actions: {
        login(user: UserInfo, token: string) {
            this.userInfo = user            // 登录操作，更新用户信息
            sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo))
            this.token = token;
            localStorage.setItem("token", token)
        },
        logout() {
            console.log("执行logout")
            localStorage.removeItem('token');
            this.userInfo = {} as UserInfo;            // 退出登录操作，清空用户信息
            this.token = '';
            sessionStorage.removeItem("userInfo")
        }
    },
});

//type.ts
export interface UserInfo {
    id:number| null,
    nick:string| null,
    phone:string| null,
    password:string| null,
    gender:string| null,
    age:number| null,
    type:number| null,  //1读者，2核查员，3管理员
  }
```


