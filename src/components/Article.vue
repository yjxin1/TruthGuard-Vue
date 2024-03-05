<!-- 帖子 -->
<template>
  <div>
    <!-- 标签 -->
    <div class="tag">
      <el-tag v-for="tag in tags" :key="tag" closable :disable-transitions="true" @close="handleClose(tag)"
        style="margin-right:10px;" v-if="store.userInfo.type !== 1">
        {{ tag }}
      </el-tag>
      <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" style="width: 100px;"
        @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
      <el-button v-else-if="store.userInfo.type !== 1" size="small" @click="showInput" style="margin-right:10px;">+
        新标签</el-button>
    </div>
    <!-- end -->
    <!-- 文章 -->
    <h2 style="text-align: center;">{{ article.title }}</h2>
    <div class="subTitle" style="text-align: center;margin:0 auto;width: 80%;">
      <span class="publishInfo">发布者：{{ article.publisher }}&nbsp;&nbsp;&nbsp;&nbsp;
        发布时间：{{ article.publishTime }}</span>
      <br>
      <span style="font-weight: bold;">流传说法：</span>
      <span v-if="article.rumorText">{{ article.rumorText }}</span>
      <span v-else>无</span>
      <br>
      <span style="font-weight: bold;">鉴定级别：</span>
      <span v-if="article.verificationLevel === 0">假</span>
      <span v-else-if="article.verificationLevel === 10">真</span>
      <span v-else-if="article.verificationLevel === 5">半真半假</span>
      <span v-else>无</span>
      <hr><br>
    </div>
    <!-- end -->
    <div style="margin:0 auto;width: 80%;">
      <div class=".v-html-container" v-html="article.summary"></div><br>
      <div class=".v-html-container" v-html="article.debunkText"></div>
    </div>

  </div>
</template>

<script lang='ts' setup>
import { ref, nextTick, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ElInput, ElMessage } from 'element-plus'
import type { Article } from '@/types'
import articleApi from '@/request/api/articleApi'
import { useInfoStore } from '@/store';
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
  verificationLevel: null,
  crawlUrl: null,
  status: null,
})
const inputValue = ref('')    //添加标签
const inputVisible = ref(false)  //添加标签显示框显示
const route = useRoute();
const InputRef = ref<InstanceType<typeof ElInput>>()
const tags = ref<string[]>([]);
const articleId = ref(0);  //文章id

onMounted(showArticle)

async function showArticle() {  //展示文章列表
  articleId.value = parseInt(route.query.id as string);
  console.log("articleId:", articleId.value)
  console.log("查询我的文章")
  let result = await articleApi.showArticleById(articleId.value)
  article.value = result.data.data[0];
  tags.value = result.data.data[1];
}

//删除标签
async function handleClose(tag: string) {
  let result = await articleApi.deleteTagByArticleId(articleId.value, tag)
  console.log("删除标签：", tag)
  tags.value.splice(tags.value.indexOf(tag), 1)
  showArticle;
}
const showInput = () => {  //显示输入框
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
async function handleInputConfirm() {  //确认添加标签
  if (inputValue.value !== null && inputValue.value !== "") {
    try {
      // let result = await axios.post(`/api/article/tag?tagName=${inputValue.value}&id=${articleId.value}`);
      let result = await articleApi.addTag(articleId.value, inputValue.value)
      if (result.data.code === 1) { ElMessage("添加成功") }
      else (ElMessage("添加失败"))
    } catch (error) {
      ElMessage("错误信息：" + error)
    }
    console.log("添加标签：", inputValue);
    tags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

</script>

<style scoped>
.v-html-container {
  font-size: 15px;
  margin: 0 auto;
  width: 50%;
  line-height: 1.5rem;
  text-align: justify !important;
  font-family: PingFang SC !important;
}

/* 使用 :deep() 代替 /deep/ */
.v-html-container :deep(p) {
  margin: 0 auto;
}

.v-html-container :deep(img) {
  max-width: 10%;
  height: auto;
}

.subTitle .publishInfo {
  font-size: 13px;
  color: #999;
}
</style>@/utils/request/artcleApi