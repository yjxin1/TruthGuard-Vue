import request from '@/request/request';
import type { Hot } from '@/types';

const weiboApi = {
    listHot(){
        const config={
            method:'get',
            url:'/api/weibo',
        }
        return request(config)
    },

}
export default weiboApi;
