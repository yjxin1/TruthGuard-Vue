import axios from 'axios'
import { useInfoStore } from '@/store';
import { ElMessage } from 'element-plus';
import {globals} from "@/main";
const store = useInfoStore();
var service = axios.create({
    timeout: 5000
})

//添加请求拦截器
service.interceptors.request.use(
    config => {
        // console.log('请求拦截器localStorage.getItem(token):',localStorage.getItem('token'))
        //添加请求头token
        if (localStorage.getItem('token')) {
            config.headers["token"] = localStorage.getItem('token');
        }
        return config
    },
    function (error) {
        return Promise.reject(error);
    }
)

//响应拦截器异常处理
service.interceptors.response.use(
    response => {
        // console.log('响应拦截器')
        return response
    },
    err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = "400请求出错"
                    break
                case 401:
                    err.message = "401授权失败，请重新登录"
                    break
                case 403:
                    err.message = "403拒绝访问"
                    break
                case 404:
                    err.message = "403请求错误，未找到资源"
                    break
                case 500:
                    err.message = "500服务器端出错"
                    break
            }
        } else {
            err.message = "链接服务器失败"
        }
        ElMessage.error({
            message: err.message
        })
    }
)
export default service