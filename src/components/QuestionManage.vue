<!--  -->
<template>
  <div>
    <!-- 查询这一栏 -->
    <el-row class="mb-1">
      <el-text>内容</el-text>
      <el-input v-model="searchCondition.questionText" placeholder="内容" style="width: 150px" />
      <el-text>发布者</el-text>
      <el-input v-model="searchCondition.answerSource" placeholder="答案来源" style="width: 100px" />
      <el-input v-model="searchCondition.answer" placeholder="答案" style="width: 80px" />
      <el-button type="primary" @click="showData">查询</el-button>
      <el-button type="info" @click="emptySearchCondition">清空</el-button>
      <el-button type="primary" @click="addQuestion">添加题目</el-button>
    </el-row>
    <!-- end -->

    <!-- 数据展示这一栏 -->
    <el-space wrap size="default">
      <el-card shadow="hover" v-for="q in questionList" :key="q.id" :body-style="{ padding: '0px' }"
        style="width:280px;height: 380px;">
        <el-image class="image" :src="q.cover">
        </el-image>
        <div style="padding: 10px">
          <span style="font-weight: bold;">题目:</span><br>
          <span class="ellipsis-text">{{ q.questionText }}</span><br>
          <span style="font-weight: bold;">答案&nbsp;:&nbsp;</span>
          <span>{{ q.answer }}</span><br>
          <span style="font-weight: bold;">来源&nbsp;:&nbsp;</span><br>
          <span class="ellipsis-text">{{ q.answerSource }}</span><br>
          <div class="bottom">
            <el-button text type="primary" class="button" @click="detail(q)">查看</el-button>
            <el-button text type="primary" class="button" @click="edit(q)">编辑</el-button>
            <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="确认删除" @confirm="deleteQuestion(q.id)"
              @cancel="">
              <template #reference>
                <el-button type="danger" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </el-card>
    </el-space>
    <!-- end -->
    <!-- 分页 -->
    <div style="margin:10px 10px;">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[12, 24, 36]"
        :small="true" :disabled="false" :background="false" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="showData" @current-change="showData" />
    </div>
    <!-- end -->
    <!-- 消息提示框，用于添加 -->
    <el-dialog v-model="addDialogVisible" title="添加题目" inline="true">
      <el-form :model="question" ref="formData">
        <el-form-item label="上传图片" :label-width="formLabelWidth">
          <div style="width:150px;height: 100x;">
            <el-upload ref="uploadRef" action="/api/image/questionCover" drag :limit="1" accept="image/*"
              :on-success="successUpload" :on-exceed="handleExceed" :before-upload="beforeUpload" :show-file-list="false" :auto-upload="true">
              <el-image class="image" v-if="imageUrl" :src="imageUrl" />
              <el-icon v-else>
                <Plus />
              </el-icon>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input v-model="question.questionText" type="textarea" :rows="5" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-select v-model="question.answer" placeholder="请选择" style="width: 100px;">
            <el-option label="真" :value="1" />
            <el-option label="假" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="答案来源" :label-width="formLabelWidth">
          <el-input v-model="question.answerSource" type="textarea" :rows="5" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCancel()">取消</el-button>
          <el-button type="primary" @click="addSure()">添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- end -->
    <!-- 消息提示框,用于编辑 -->
    <el-dialog v-model="editDialogVisible" title="编辑用户信息">
      <el-form :model="question">
        <el-form-item label="嫌疑说法" :label-width="formLabelWidth">
          <el-input v-model="question.questionText" type="textarea" placeholder="字数不少于1字,不超过1000字" :minlength="1"
            :maxlength="1000" :rows="6" autocomplete="off" />
        </el-form-item>
        <el-form-item label="答案来源" :label-width="formLabelWidth">
          <el-input v-model="question.answerSource" type="textarea" placeholder="字数不少于1字,不超过1000字" :minlength="1"
            :maxlength="1000" :rows="3" autocomplete="off" />
        </el-form-item>
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-select v-model="question.answer" placeholder="请选择">
            <el-option label="真" :value="1" />
            <el-option label="假" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editSure()">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- end -->
    <!-- 抽屉 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h2>详情</h2>
      </template>
      <el-image class="image" :src="question.cover">
      </el-image>
      <div style="padding: 10px">
        <span style="font-weight: bold;">嫌疑说法:</span><br>
        <span>{{ question.questionText }}</span><br>
        <span style="font-weight: bold;">答案&nbsp;:&nbsp;</span>
        <span>{{ question.answer }}</span><br>
        <span style="font-weight: bold;">答案来源&nbsp;:&nbsp;</span><br>
        <span>{{ question.answerSource }}</span><br>
      </div>
    </el-drawer>
    <!-- end -->
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted,nextTick } from 'vue'
import type { Question } from '@/types';
import { Picture } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import questionApi from '@/request/api/questionApi'
import type { UploadProps, UploadInstance ,UploadRawFile } from 'element-plus'
import { genFileId } from 'element-plus'

//数据
const uploadRef = ref<UploadInstance>()
const imageUrl = ref('');  //el-upload会返回临时的上传的图片的URL,用于在客户端显示上传的图片
const formLabelWidth = '100px' //消息提示框的样式，不用管
const currentPage = ref(1)  //当前页
const pageSize = ref(12)  //页大小
const total = ref(0) //返回查询结果总数
const questionList = ref<Question[]>([])  //列表
const question = ref<Question>({
  id: null,
  questionText: null,
  answer: null,
  answerSource: null,
  cover: null,
})
const router = useRouter();
const ids = ref<number[]>([]); //多选框存储选中ID，可以批量删除
const searchCondition = ref({  //搜索条件
  questionText: '',  //内容
  answer: null,  //答案
  answerSource: '',   //答案来源
})
const editDialogVisible = ref(false)  //编辑提示框
const addDialogVisible = ref(false) //添加提示框
const drawer = ref(false)  //抽屉
//方法
onMounted(() => {
  showData()
})
async function showData() {
  console.log("展示数据")
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    questionText: searchCondition.value.questionText,
    answer: searchCondition.value.answer,
    answerSource: searchCondition.value.answerSource,
  }
  let result = await questionApi.page(params)
  questionList.value = result.data.data.rows;
  total.value = result.data.data.total;
  console.log("questionList:", questionList.value)
}
//清空搜索条件
function emptySearchCondition() {
  searchCondition.value.answer = null;
  searchCondition.value.answerSource = '';
  searchCondition.value.questionText = '';
}
//添加
function addQuestion() {
  console.log("添加题目")
  question.value = {  //清空
    id: null,
    questionText: null, answer: null,
    answerSource: null,
    cover: null,
  }
  imageUrl.value = '';
  addDialogVisible.value = true;
}
async function addSure() {
  console.log("确认添加")
  if (question.value.answer === null || question.value.questionText === null) {
    ElMessage("答案或内容不能为空");
    return;
  }
  let result = await questionApi.add(question.value)
  if (result.data.code === 1) {
    ElMessage('添加成功')
    showData();
    addDialogVisible.value = false;
  }
}

//上传图片
function beforeUpload(file: File) {
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    ElMessage.error("上传图片大小不能超过 1M");
    return false
  } else {
    return true;
  }
}
const successUpload: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  question.value.cover = response;
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  console.log("@@@",response.status)
  console.log("上传成功,返回图片地址为:", response)
}
const handleExceed: UploadProps['onExceed'] = (files) => {  //
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
  uploadRef.value!.submit()

}
//取消添加
async function addCancel() {
  console.log("取消添加")
  if (question.value.cover !== null) {
    let result = await questionApi.cancelCover(question.value.cover)
    if (result.data.code === 1) {
      ElMessage("取消添加")
    }
  }
  addDialogVisible.value = false;
}

//展示详情
function detail(q: Question) {
  drawer.value = true;
  question.value.cover = q.cover;
  question.value.answer = q.answer;
  question.value.answerSource = q.answerSource;
  question.value.id = q.id;
  question.value.questionText = q.questionText;
}
//删除
async function deleteQuestion(id: number | null) {
  console.log("删除问题,id为:", ids.value)
  ids.value = [];
  if (id == null) {
    console.log("要删除的id为空,删除失败");
    return
  }
  ids.value.push(id);
  let result = await questionApi.deleteByIds(ids.value)
  if (result.data.code === 1) {
    ElMessage('删除成功')
    showData();
  }
}
//编辑
const edit = (q: Question) => {
  console.log("编辑id:", q)
  question.value = q
  // question.value.cover=null;//不能修改封面
  editDialogVisible.value = true
}
//数据表格编辑完成按钮
async function editSure() {
  console.log("弹出编辑表单")
  // let result = await axios.put('/api/user', user.value)
  let result = await questionApi.update(question.value)
  editDialogVisible.value = false
  if (result.data.code === 1) {
    console.log('编辑成功')
    ElMessage('编辑成功')
  }
  question.value = {  //清空
    id: null,
    questionText: null, answer: null,
    answerSource: null,
    cover: null,
  }
}
</script>

<style scoped>
.el-space{
  margin-left: 45px;
}
.bottom {
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  aspect-ratio: 3/2;
  width: 100%;
  display: block;
}

.mb-1 .el-text {
  margin-right: 10px;
  margin-bottom: 10px;
}

.mb-1 .el-input {
  margin-right: 10px;
  margin-bottom: 10px;
}

.mb-1 .el-select {
  margin-right: 10px;
  margin-bottom: 10px;
}

.ellipsis-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
  position: relative;
  /* 相对定位，用于设置悬浮框的位置 */
}
</style>
