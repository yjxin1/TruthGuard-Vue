<!--  -->
<template>
  <div>
    <!-- 查询这一栏 -->
    <el-row class="mb-1">
      <el-text>标题</el-text>
      <el-input v-model="searchCondition.title" placeholder="标题" style="width: 150px" />
      <el-text>手机号</el-text>
      <el-input v-model="searchCondition.phone" placeholder="手机号" style="width: 150px" />
      <el-select v-model="searchCondition.field" placeholder="请选择" style="width: 200px">
        <el-option v-for="f in fields" :label="f" :value="f" />
      </el-select>
      <div>
        <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始时间"
          end-placeholder="结束时间" size="default" value-format="YYYY-MM-DD" />
      </div>
      <el-button type="primary" @click="showData">查询</el-button>
      <el-button type="info" @click="empty">清空</el-button>
    </el-row>
    <!-- end -->
    <!-- 数据展示 -->
    <el-space wrap size="default">
      <el-card shadow="hover" v-for="c in clueList" :key="c.id" @click="detail(c)" :body-style="{ padding: '0px' }"
        style="width:350px;height: 150px;">
        <div style="padding: 15px;border: 1px solid rgba(43, 42, 38, 0.53);">
          <el-row class="ellipsis-text">
            {{ c.title }}
            <span style="font-size: 11px;color: #999;">{{ c.submitTime }}</span>
          </el-row>
          <div style="font-size: 11px;color: #999;">
            <span>电话：{{ c.phone }}</span><br>
            <span>类别：{{ c.field }}</span><br>
            <span class="ellipsis-text">链接：{{ c.link }}</span>
          </div>
          <div class="ellipsis-text">
            {{ c.content }}
          </div>
        </div>
      </el-card>
    </el-space>
    <!-- end -->
    <!-- 分页 -->
    <div class="demo-pagination-block" style="margin:10px 10px;">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30]"
        :small="true" :disabled="false" :background="false" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="showData" @current-change="showData" />
    </div>
    <!-- end -->
    <!-- 抽屉展示详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h2>线索详情</h2>
      </template>
      <h3>{{ clue.title }}</h3>
      <div>
      <div style="font-size: 11px;color: #999;">
        <span>提交时间：</span><span>{{ clue.submitTime }}</span><br>
        <span>电话：</span><span>{{ clue.phone }}</span><br>
        <span>类别：</span><span>{{ clue.field }}</span><br>
        <span>链接：</span><span>{{ clue.link }}</span><br>
      </div>
    </div>
      <span style="font-weight: bold;">内容:</span><br><span>{{ clue.content }}</span>
    </el-drawer>
    <!-- end -->
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import type { Clue } from '@/types'
import clueApi from '@/request/api/clueApi'
import { ElMessage } from 'element-plus'

//数据
const clue = ref<Clue>({
  id: null,
  link: null,
  title: null,
  content: null,
  submitTime: null,
  phone: null,
  field: null,
})
const drawer = ref(false)
const clueList = ref<Clue[]>([])
const currentPage = ref(1)  //当前页
const pageSize = ref(10)  //页大小
const total = ref(0) //返回查询结果总数
const searchCondition = ref({  //搜索条件
  title: '',
  phone: '',
  field: '',
})
const time = ref('')
const fields = [
  '新冠肺炎疫情专项',
  '时事政治',
  '党史国史',
  '食药卫生',
  '公共政策',
  '公共安全',
  '突发事件',
  '科学常识',
  '社会热点',
  '其他'
];
//方法
onMounted(() => {
  showData();
})
async function showData() {
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    title: searchCondition.value.title,
    phone: searchCondition.value.phone,
    field: searchCondition.value.field,
    begin: time.value[0],
    end: time.value[1],
  }
  let result = await clueApi.page(params)
  if (result.data.code === 1) {
    console.log('@', result)
    clueList.value = result.data.data.rows
    total.value = result.data.data.total
  } else {
    console.log('@', result.data)
    ElMessage("错误信息", result.data.msg);
  }
}
//抽屉，展示线索详情
function detail(c: Clue) {
  clue.value = { id: null, link: null, title: null, content: null, submitTime: null, phone: null, field: null }
  console.log('跳出弹窗:c.content:', c)
  if (c === null) return;
  drawer.value = true;
  clue.value = c;

}
function empty() {
  searchCondition.value.field = '';
  searchCondition.value.title = '';
  searchCondition.value.phone = '';
  time.value = '';
}

</script>

<style scoped>
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
  /* 防止文本换行 */
  overflow: hidden;
  /* 隐藏溢出部分文本 */
  text-overflow: ellipsis;
  /* 显示省略号 */
  display: inline-block;
  /* 必须设置为块级元素才能生效 */
  max-width: 300px;
  /* 最大宽度，根据需要调整 */
  position: relative;
  /* 相对定位，用于设置悬浮框的位置 */
}

a {
  color: inherit;
  text-decoration: none;
  /* 去除下划线 */
}
</style>