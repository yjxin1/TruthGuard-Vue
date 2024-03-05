<!--  -->
<template>
  <div class="container">
    <el-row class="mb-1" style="margin-bottom: 10px;">
      <el-text>题库共{{ total }}题</el-text>
      <el-text>当前页：</el-text>
      <el-input v-model="currentPage" type="number" size="small" @blur="getData" @keyup.enter="getData"
        style="width: 60px;">{{ currentPage
        }}</el-input>
      <el-text>一页有{{ pageSize }}题</el-text>
      <el-text>现在是第{{ index + 1 }}题</el-text>
    </el-row>
    <div class="card">
      <el-image class="image" :src="`/api/${question.cover}`">
      </el-image>
      <div style="padding: 10px">
        <span style="font-weight: bold;">嫌疑说法:</span><br>
        <span>{{ question.questionText }}</span><br>
      </div>
      <el-row style="margin-bottom: 10px;">
        <el-button type="primary" round @click="submitAnswer(1)">真</el-button>
        <el-button type="primary" round @click="submitAnswer(0)">假</el-button>
      </el-row>
      <el-row style="margin-bottom: 10px;">
        <el-button type="primary" round @click="lastQuestion">上一题</el-button>
        <el-button type="primary" round @click="showAnswer">展示答案</el-button>
        <el-button type="primary" round @click="nextQuestion">下一题</el-button>
      </el-row>
      <div v-if="isAnswerVisible">
        <span style="font-weight: bold;">答案&nbsp;:&nbsp;</span>
        <span>{{ question.answer }}</span><br>
        <span style="font-weight: bold;">答案来源&nbsp;:&nbsp;</span><br>
        <span>{{ question.answerSource }}</span><br>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import type { Question } from '@/types'
import questionApi from '@/request/api/questionApi'
import { ElMessage } from 'element-plus';

//数据
const isAnswerVisible = ref(false); //不展示答案
const index = ref(0);
const currentPage = ref(1)  //当前页
const pageSize = ref(10)  //页大小
const total = ref(0) //返回查询结果总数
const questionList = ref<Question[]>([]);
const question = ref<Question>({
  id: null,
  questionText: null,
  answer: null,
  answerSource: null,
  cover: null,
})

//方法
onMounted(() => {
  getData();
})
async function getData() {
  console.log("获取数据")
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
  }
  let result = await questionApi.page(params)
  questionList.value = result.data.data.rows;
  total.value = result.data.data.total;
  console.log("questionList:", questionList.value)
  question.value = questionList.value[index.value];
}
function submitAnswer(answer: number) {   //提交答案
  if (question.value.answer == answer) {  //答对
    ElMessage.success("答对了")
  } else {  //答错
    ElMessage.error("答错了")
  }

}
function showAnswer() {  //展示答案
  isAnswerVisible.value = true;
}
function nextQuestion() {  //下一题
  isAnswerVisible.value = false;
  if (index.value >= questionList.value.length - 1) {
    ElMessage("已经该页是最后一题")
    return
  }
  index.value++;
  question.value = questionList.value[index.value]

}
function lastQuestion() {  //上一题
  isAnswerVisible.value = false;
  if (index.value <= 1) {
    ElMessage("已经该页是第一题")
    return
  }
  index.value--;
  question.value = questionList.value[index.value]
}

</script>

<style scoped>
.container {
  padding: 10px;
  display: flex;
  justify-content: center; /* 水平居中 */
}

.mb-1 .el-text {
  margin-right: 10px;
  margin-bottom: 10px;
}

.mb-1 .el-input {
  margin-right: 10px;
  margin-bottom: 10px;
}

.image {
  aspect-ratio: 3/2;
  width: 400px;
  display: block;
}

.el-carousel__item:nth-child(2n) {
  background-color: #d3dce6;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>