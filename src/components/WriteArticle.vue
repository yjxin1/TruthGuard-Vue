<!--  -->

<template>
    <!-- 标题，发布者，谣言原文，鉴定级别，查证要点，辟谣正文 -->
    <div>
        <div class="container" >
            <el-form :model="article" label-width="70px" v-if="1">
                <el-form-item label="标题">
                    <el-input v-model="article.title" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="发布者">
                    <el-text style="font-weight: bold;">{{ store.userInfo.nick }}</el-text>
                </el-form-item>
                <el-form-item label="流传说法">
                    <el-input v-model="article.rumorText" type="textarea" placeholder="字数不少于1字,不超过1000字" :minlength="1"
                        :maxlength="1000" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="鉴定级别">
                    <el-select v-model="article.verificationLevel" placeholder="鉴定级别" style="width: 100px">
                        <el-option label="真" :value="10" />
                        <el-option label="半真半假" :value="5" />
                        <el-option label="假" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="查证要点">
                    <el-input v-model="article.summary" type="textarea" placeholder="字数不少于1字,不超过1000字" :minlength="1"
                        :maxlength="1000" :rows="5"></el-input>
                </el-form-item>
            </el-form>
            <div style="display: flex; justify-content: center;">
                <el-text style="margin: 10px;font-weight: bold;font-size: 20px;">辟谣正文</el-text>
            </div>
            <div id="tiny"></div>
            <el-popconfirm width="220" confirm-button-text="确认" cancel-button-text="不，继续编辑" @confirm="submitArticle"
                icon-color="#626AEF" title="确认提交吗？这会清空目前编辑的内容">
                <template #reference>
                    <el-button type="primary" round style="margin: 10px auto;display: block;">提交并上架</el-button>
                </template>
            </el-popconfirm>
        </div>
        <div class="right" style="float: right;">
            <el-text style="font-weight: bold;font-size: 20px;">微博热搜榜单</el-text>
            <tr v-for="h in hotList">
                <td>{{ h.rank }}</td>
                <td><a v-if="h.link" :href="h.link" target="_blank">{{ h.topic }}</a><span>{{ h.label }}</span></td>
            </tr>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, onBeforeUnmount, unref } from "vue";
import tinymce from "tinymce";
import type { Article, Hot } from '@/types'
import { useInfoStore } from '@/store';
import articleApi from "@/request/api/articleApi"
import weiboApi from "@/request/api/weiboApi"
import { ElMessage } from 'element-plus'
import axios from "axios";
//数据

const store = useInfoStore()
const article = ref<Article>({
    id: null,
    title: null,
    rumorText: null,
    debunkText: null,
    publisher: null,
    publishTime: null,
    summary: null,
    crawlSource: null, //1-本系统，2-中互，3-较真，4-果壳
    verificationLevel: null,  //鉴定级别，10为真，5为半真半假，0为假
    crawlUrl: null, //文章链接
    status: null,   //上架状态：1上架，0未上架
})
const hot = ref<Hot>({
    id: null,
    rank: null,
    topic: null,
    link: null,
    timestamp: null, // 使用当前时间作为时间戳
    label: null,
});
const hotList = ref<Hot[]>([])
const content = ref(""); // 用于存储编辑器的内容
const initOptions = {
    selector: "#tiny",
    height: 500,
    content_style: "body { font-size: 16px; } img {max-width:100%;}",
    branding: false,
    statusbar: true,
    language: "zh-Hans",
    convert_urls: false,
    images_upload_url: "/image",
    plugins: "wordcount", // 编辑器使用的插件，这里使用了 wordcount 插件，用于统计字数
    paste_data_images: true, // 是否允许粘贴图片到编辑器中
    // toolbar:
    //     "undo redo | outdent indent | image | wordcount", // 编辑器的工具栏按钮配置，这里设置了一组工具按钮
    menubar: 'file insert format table tools help',

    setup: function (editor: any) {
        editor.on('change', function () {
            content.value = editor.getContent(); // 更新内容到ref中
            console.log("content:/n", content.value);
            // 获取编辑器中的HTML内容
            var htmlContent = editor.getContent();
            // 创建一个临时div元素，用于解析HTML内容
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            var oldImgTags = tempDiv.querySelectorAll("img")
            // 打印提取的img标签
            oldImgTags.forEach(function (imgTag) {
                console.log("@@@", imgTag);
            });
        });
    },
};
//方法

// 初始化编辑器
onMounted(() => {
    tinymce.init(initOptions);
    showHot();
});

onBeforeUnmount(() => {
    if (tinymce !== null) {
        tinymce?.remove?.(unref(initOptions).selector!);
    }
});
async function showHot() {
    let result = await weiboApi.listHot();
    if (result.data.code == 1) {
        hotList.value = result.data.data;
    }
}
async function submitArticle() {
    article.value.status = 1;
    article.value.crawlSource = 1;  //本系统
    article.value.debunkText = content.value;
    article.value.publisher = store.userInfo.nick;
    console.log("@@@article为：", article)
    if (article.value.title == null || article.value.title == "") {
        ElMessage.error("标题不能为空")
        return
    }
    let result = await articleApi.add(article.value);
    if (result.data.code == 0) {
        ElMessage.error(result.data.msg);
        return
    } else if (result.data.code == 1) {
        article.value = {  //清空
            id: null,
            title: null,
            rumorText: null,
            debunkText: null,
            publisher: null,
            publishTime: null,
            summary: null,
            crawlSource: null, //1-本系统，2-中互，3-较真，4-果壳
            verificationLevel: null,  //鉴定级别，10为真，5为半真半假，0为假
            crawlUrl: null, //文章链接
            status: null,   //上架状态：1上架，0未上架
        }
        tinymce.get('tiny')?.setContent('')
        ElMessage("提交成功")
    }
}

</script>

<style scoped>
.container {
    border: 2px solid rgba(0, 0, 0, 0.355);
    padding: 20px 20px;
    margin: 20px 20px;
    width: 700px;
    float: left;
    /* text-align: center; */
}
a {
  color: inherit;
  text-decoration: none;
  /* 去除下划线 */
}
/* 清除浮动，防止后续元素受到影响 */
.clearfix:after {
    content: "";
    display: table;
    clear: both;
}
</style>