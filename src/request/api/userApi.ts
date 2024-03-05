import request from '@/request/request';
import type { UserInfo } from '@/types';

const userApi = {
    example(){
        const config={
            method:'',
            url:'',
        }
        return request(config)
    },
    //分页查询
    page(params:any) {
        const config = {
            method: 'get',
            url: 'api/user/page',
            params:params
        }
        return request(config)
    },
    //更新
    update(user:Partial<UserInfo>){
        const config = {
            method: 'put',
            url: 'api/user',
            data:user
        }
        return request(config)
    },
    //根据ids批量删除用户
    deleteByIds(ids:number[]){
        const config={
            method:'delete',
            url:`/api/user/${ids.join(',')}`,
        }
        return request(config)
    },
    //添加用户
    add(user:Partial<UserInfo>){
        const config={
            method:'post',
            url:'api/user',
            data:user
        }
        return request(config)
    },
    //修改密码
    changePsw(params:any){
        const config={
            method:'put',
            url:'api/user/changePsw',
            params:params
        }
        return request(config)
    }

}
export default userApi