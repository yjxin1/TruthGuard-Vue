import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import axios from 'axios'


import App from './App.vue'
import router from './router'

const app = createApp(App)

/*读取外部文件配置*/
axios.get('/config.json').then((res)=>{
    app.config.globalProperties.$config = res.data
})
export const globals = app.config.globalProperties;
app.use(createPinia())
app.use(router)
app.use(ElementPlus,{  //ElementPlus语言为中文
    locale:zhCn,
    size:'default',
})

app.mount('#app')
