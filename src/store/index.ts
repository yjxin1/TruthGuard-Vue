// 记录当前登录用户信息：nick,phone,gender,age,type
import type { UserInfo } from '@/types';
import { defineStore } from 'pinia';

export const useInfoStore = defineStore('info', {
    state: () => ({
        token: '',
        userInfo: JSON.parse(sessionStorage.getItem("userInfo") || "{}") as UserInfo  //从sessionStorage读取
    }),
    actions: {
        login(user: UserInfo, token: string) {
            this.userInfo = user            // 登录操作，更新用户信息
            sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo))
            this.token = token;
            localStorage.setItem("token", token)

        },
        logout() {
            console.log("执行logout")
            localStorage.removeItem('token');
            this.userInfo = {} as UserInfo;            // 退出登录操作，清空用户信息
            this.token = '';
            sessionStorage.removeItem("userInfo")
        }
    },
});
