import request from '@/request/request';
import type { Article } from '@/types';

const articleApi = {
    //根据文章id查看文章
    showArticleById(articleId: number) {
        const config = {
            method: 'get',
            url: `/api/article/${articleId}`
        }
        return request(config)
    },
    //删除标签，根据articleId和tagName
    deleteTagByArticleId(articleId: number, tagName: string) {
        const config = {
            method: 'delete',
            url: `/api/article/tag`,
            params: {
                id: articleId,
                tagName: tagName
            }
        }
        return request(config)
    },
    //添加标签,根据articleId和tagName
    addTag(articleId: number, tagName: string) {
        const config = {
            method: 'post',
            url: `/api/article/tag?tagName=${tagName}&id=${articleId}`,
        }
        return request(config)
    },
    //分页展示and条件查询，根据标题、发布者、发布时间、爬取来源，鉴定级别，分页展示文章标题、发布者、发布时间、爬取来源、鉴定级别、爬取链接
    page(params: any) {
        const config = {
            method: 'get',
            url: '/api/article/page',
            params: params
        }
        return request(config)
    },
    //根据ids删除文章
    delete(ids: number[]) {
        const config = {
            method: 'delete',
            url: `/api/article/${ids.join(',')}`,
        }
        return request(config)
    },
    //修改文章，只允许修改文章标题、发布状态
    update(article:Partial<Article>){
        const config = {
            method: 'put',
            url: '/api/article',
            data:article
        }
        return request(config)
    },
    //添加文章
    add(article:Partial<Article>) {
        const config = {
            method: 'post',
            url: '/api/article',
            data:article,
        }
        return request(config)
    },
    //档案，获取所有的标签
    getAllTag(){
        const config = {
            method: 'get',
            url: '/api/article/tag',
        }
        return request(config)
    },
    //通过标签名获取带有该标签的文章
    showArticleByTag(tagName:string){
        const config = {
            method: 'get',
            url: `/api/article/tag/${tagName}`,
        }
        return request(config)
    },
}

export default articleApi;

