<!--  -->
<template>
  <div class="container">
    <el-row class="mb-1" style="margin-bottom: 10px;">
      <el-text v-if="0">题库共{{ total }}题</el-text>
      <el-text>共{{ Math.floor(total / pageSize) + 1 }}个题集</el-text>
      <el-text>当前题集：</el-text>
      <el-input v-model="currentPage" type="number" size="small" @blur="getData" @keyup.enter="getData"
        style="width: 60px;">{{ currentPage
        }}</el-input>
      <el-text>{{ index + 1 }}/{{ questionList.length }}题</el-text>
    </el-row>
    <el-row><el-button plain type="warning" style="margin-left: 16px" @click="drawer = true; getRecordList()">
        查看历史答题记录
      </el-button></el-row>
    <div class="mb-2">
      <div class="card">
        <el-image class="image" :src="`/api/${question.cover}`">
        </el-image>
        <div style="padding: 5px">
          <span style="font-weight: bold;margin: auto;">题目:</span><br>
          <span>{{ question.questionText }}</span><br>
        </div>
        <div class="button-wrapper">
          <el-row v-if="visible" style="margin-bottom: 5px;">
            <el-button type="warning" round @click="submitAnswer(1); showAnswer()">真</el-button>
            <el-button type="warning" round @click="submitAnswer(0); showAnswer()">假</el-button>
          </el-row>
          <el-row style="margin-bottom: 5px;">
            <!-- <el-button type="warning" round @click="lastQuestion">上一题</el-button> -->
            <!-- <el-button type="primary" round @click="showAnswer">展示答案</el-button> -->
            <el-button type="warning" round @click="nextQuestion">下一题</el-button>
          </el-row>
        </div>
        <div v-if="isAnswerVisible">
          <span style="font-weight: bold;">答案&nbsp;:&nbsp;</span>
          <span>{{ question.answer }}</span><br>
          <span style="font-weight: bold;">答案来源&nbsp;:&nbsp;</span><br>
          <span>{{ question.answerSource }}</span><br>
        </div>

      </div>
      <div class="result">
        <div style="margin-bottom: 5px;">
          <div style="font-weight: bold;">题目总数</div>
          <div>{{ pageSize }}</div>
          <div style="font-weight: bold;">答对数量</div>
          <div>{{ count }}</div>
          <!-- <div style="font-weight: bold;">错误数量</div>
          <div>20</div> -->
        </div>
      </div>
    </div>
    <el-drawer v-model="drawer" direction="rtl">
      <template #header>
        <h2>历史答题记录</h2>
      </template>
      <template #default>
        <div style="margin-bottom: 10px;">近五条记录的正确率：{{ getAccuracy() }}%</div>
        <div>
          <el-table :data="questionRecordList" border stripe>
            <el-table-column prop="goodNum" label="正确数" width="100px"></el-table-column>
            <el-table-column prop="questionNum" label="答题数" width="80px"></el-table-column>
            <el-table-column prop="updateTime" label="时间"></el-table-column>
          </el-table>
        </div>
      </template>
      <!-- <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template> -->
    </el-drawer>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import type { Question, QuestionRecord } from '@/types'
import questionApi from '@/request/api/questionApi'
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UserInfo } from '@/types'
import { useInfoStore } from "@/store"
const store = useInfoStore();
const userInfo = store.$state.userInfo;

//数据
const count = ref(0);  //答对数量
const visible = ref(true)  //展示答题按钮
const isAnswerVisible = ref(false); //不展示答案
const index = ref(0);
const drawer = ref(false)
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
const questionRecordList = ref<QuestionRecord[]>([]);

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
  if (result.data.data.total === 0) {
    ElMessage("暂无更多题集")
  } else {
    questionList.value = result.data.data.rows;
    total.value = result.data.data.total;
    console.log("questionList:", questionList.value)
    question.value = questionList.value[index.value];
  }

}
function submitAnswer(answer: number) {   //提交答案
  if (question.value.answer == answer) {  //答对
    ElMessage.success("答对了")
    count.value = count.value + 1;
    visible.value = false;
  } else {  //答错
    ElMessage.error("答错了")
    visible.value = false;
  }

}
function showAnswer() {  //展示答案
  isAnswerVisible.value = true;
}
async function nextQuestion() {  //下一题
  isAnswerVisible.value = false;
  visible.value = true;
  if (index.value >= questionList.value.length - 1) { //答题完成，提交答案并清空数据
    ElMessage("答题完成")
    let questionRecord: QuestionRecord = {
      id: null,
      userId: userInfo.id,
      goodNum: count.value,
      questionNum: questionList.value.length,
      updateTime: null,
    }
    let result = await questionApi.addRecord(questionRecord)
    if (result.data.code === 1) {
      ElMessage("已保存记录")
      open();
      empty(); // 重新加载页面
    }
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
async function getRecordList() {
  if (userInfo.id !== null) {
    let result = await questionApi.getRecord(userInfo.id);
    if (result.data.code === 1) {
      console.log(result.data.data)
      questionRecordList.value = result.data.data;
      console.log(questionRecordList.value)
    }
  }
}

function getAccuracy() {
  let totalCorrect = 0;
  let totalQuestions = 0;
  questionRecordList.value.slice(0, 5).forEach(record => {
    if (record.goodNum != null&&record.questionNum!==null) {
      totalCorrect += record.goodNum;
      totalQuestions += record.questionNum;
    }

  });
  const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  return accuracy.toFixed(2); // 保留两位小数
}

function empty() {
  count.value = 0;
  index.value = 0;
  // getData()
}

//弹窗
const open = () => {
  ElMessageBox.alert(`正确数：${count.value}，答题数：${questionList.value.length}`, '保存记录', {
    confirmButtonText: 'OK',
  })
}

</script>

<style scoped>
.container {
  padding: 10px;
  display: flex;
  position: relative;
  /* 让容器成为定位上下文 */
}

.card {
  flex: 1;
  padding: 30px;
  width: 480px;
  border-radius: 10px;
  background-color: antiquewhite;
  position: absolute;
  /* 绝对定位 */
  top: 50%;
  left: 30%;

}

.result {
  border-radius: 10px;
  padding: 10px;
  width: 100px;
  /* 设置卡片宽度 */
  position: absolute;
  /* 将 result 设为绝对定位 */
  top: 10px;
  /* 距离容器顶部的距离 */
  right: 10px;
  /* 距离容器右侧的距离 */
  background-color: antiquewhite;

}

.button-wrapper {
  display: flex;
  /* 设置为弹性布局 */
  flex-direction: column;
  /* 主轴方向为垂直方向 */
  align-items: center;
  /* 交叉轴方向居中对齐 */
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