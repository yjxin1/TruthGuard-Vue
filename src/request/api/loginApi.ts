import request from '@/request/request';
import type { UserInfo } from '@/types';

const loginApi = {
    //登录,返回userInfo和token
    login(user:Partial<UserInfo>) {
        const config = {
            method: 'post',
            url: '/api/login',
            data:user
        }
        return request(config)
    },
    register(user:Partial<UserInfo>){
        const config = {
            method:'post',
            url:'/api/register',
            data:user
        }
        return request(config)
    }
}
export default loginApi