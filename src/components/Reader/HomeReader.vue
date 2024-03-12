<!-- 用户首页 -->
<template>
    <div>
        <!-- 今日辟谣 -->
        <div class="part">
            <h1 style="margin: 10px;">近一周资讯&nbsp;（{{ currentDate.getFullYear() }}年{{ currentDate.getMonth() + 1 }}月{{
                currentDate.getDate() }}日）</h1>
            <div class="content" >
                <ul>
                    <li v-for="a in articleList" @click="showArticle(a.id)">
                        {{ a.title }} &nbsp;&nbsp;
                        <span style="font-size: 12px;color: #999;">{{ a.publishTime }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!-- end -->
        <!-- 今日热点 -->
        <!-- end -->
    </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import type { Article } from '@/types'
import articleApi from '@/request/api/articleApi'
import { useRouter } from 'vue-router';
const router = useRouter();
//数据
const currentDate = ref(new Date())
const timeRange = ref({
    begin: new Date('2020-01-01T00:00:00'),
    end: new Date('2024-01-01T00:00:00')
});
const articleList = ref<Article[]>([])  //文章列表

//方法
onBeforeMount(() => {
    //创建一个新的 Date 对象，获取当前时间的年、月、日
    const end = new Date()
    const begin = new Date()
    begin.setTime(begin.getTime() - 3600 * 1000 * 24 * 7)
    timeRange.value.begin = begin;
    timeRange.value.end = end;
})
onBeforeMount(showData)
//展示数据
async function showData() {
    console.log("条件查询", timeRange.value.begin.toISOString().split('T')[0], timeRange.value.end.toISOString().split('T')[0])
    const params = {
        page: 1,
        pageSize: 10,
        // verificationLevel: 0,  //鉴定级别
        status: 1, //发布状态
        begin: timeRange.value.begin.toISOString().split('T')[0],
        end: timeRange.value.end.toISOString().split('T')[0],
    }
    let result = await articleApi.page(params)
    articleList.value = result.data.data.rows;
}
//根据id查看文章
function showArticle(id: number | null) {
  if (id == null) {
    console.log("文章为空")
    return
  }
  console.log("根据id查看文章,id为:", id);
  router.push({ path: `/${router.currentRoute.value.path.split('/')[1]}/article`, query: { id: id } });
}
</script>

<style scoped>
.part {
    display: inline-block;
    margin: 15px;
}
.content{
    width: 800px;height: auto;
}
ul{
    list-style-type: none;
}
li{
    margin:5px 5px 0 0;
}
ul li:hover {
  cursor: pointer;
}
</style>