import request from '@/request/request';
import type { Clue } from '@/types';

const clueApi = {
    //展示Clue
    page(params:any) {
        const config = {
            method: 'get',
            url: '/api/clue/page',
            params:params,
        }
        return request(config)
    },
    //提交Clue
    add(clue:Clue) {
        const config = {
            method: 'post',
            url: '/api/clue',
            data:clue,
        }
        return request(config)
    },
}
export default clueApi;