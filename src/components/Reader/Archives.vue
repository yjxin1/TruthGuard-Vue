<!-- 档案展示 -->
<template>
    <div>

        <div class="container" ref="tagsContainer">
            <h1 style="color: rgba(224, 175, 16, 0.742);font-size: 20px;font-weight: bold;">档案：标签</h1>
            <div class="mb">
                <span class="tag" v-for="(tag, index) in tagList" :key="index" @click="handleTagClick(tag)">{{ tag }}
                </span>
            </div>
        </div>
        <el-drawer v-model="drawer">
            <template #header>
                <h2>带标签【{{ tagName }}】的文章：</h2>
            </template>
            <ul>
                <li v-for="a, index in articleList" @click="showArticle(a.id)">
                    {{ index + 1 }}.&nbsp;{{ a.title }} &nbsp;&nbsp;
                    <span style="font-size: 12px;color: #999;">{{ a.publishTime }}</span>
                </li>
            </ul>
        </el-drawer>
    </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import articleApi from '@/request/api/articleApi'
import type { Article } from '@/types'
import { useRouter } from 'vue-router';
const router = useRouter();
//数据
const tagList = ref<string[]>([]); //标签列表数据
const articleList = ref<Article[]>([])  //文章列表
const drawer = ref(false)
const tagName = ref("")
const tagsContainer = ref(null); // 添加 ref

//方法
onMounted(() => {
    getData();
})
//获取所有标签
async function getData() {
    console.log("获取档案的标签")
    let result = await articleApi.getAllTag()
    if (result.data.code === 1) {
        tagList.value = result.data.data;
        tagList.value = tagList.value.slice().sort((a, b) => a.localeCompare(b, 'zh'));  //由拼音首字母进行排序
    }
}
//点击tag获取带有tag的文章
async function handleTagClick(tag: string) {
    tagName.value = tag
    console.log('Clicked tag:', tag);
    drawer.value = true  //展示抽屉
    let result = await articleApi.showArticleByTag(tag)
    console.log("@", result.data.data)
    articleList.value = result.data.data
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
.container {
    border: 1px solid rgba(224, 175, 16, 0.53);
    margin: 15px;
    padding: 15px 15px 15px 15px;
}


.tag {
    width: 150px;
    display: inline-block;
    font-size: 15px;
    font-weight: bold;
    margin: 10px;
}

ul {
    list-style-type: none;
}

ul li:hover {
    cursor: pointer;
}

span:hover {
    cursor: pointer;
}
</style>