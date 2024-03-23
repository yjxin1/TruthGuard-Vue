<!-- 查证 -->
<template>
  <div>
    <div class="container">
      <!-- 查询这一栏 -->
      <el-row class="mb-1">
        <el-text>标题</el-text>
        <el-input v-model="searchCondition.title" placeholder="输入标题" style="width: 150px" />
        <el-select v-model="searchCondition.verificationLevel" placeholder="鉴定级别" style="width: 100px">
          <el-option label="真" :value="10" />
          <el-option label="半真半假" :value="5" />
          <el-option label="假" :value="0" />
        </el-select>
        <div>
          <el-date-picker :shortcuts="shortcuts" v-model="time" type="daterange" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" size="default" value-format="YYYY-MM-DD" />
        </div>
        <el-button type="primary" @click="showData">查询</el-button>
        <el-button type="info" @click="emptySearchCondition">清空</el-button>
      </el-row>
      <!-- end -->
      <!-- 数据展示这一栏 -->
      <div class="part">
        <h1 style="margin: 10px;color:rgba(224, 175, 16, 0.53);font-size: 20px  ;">为您找到以下结果：</h1>
        <div class="content">
          <ul>
            <li v-for="a in articleList" @click="showArticle(a.id)">
              {{ a.title }} &nbsp;&nbsp;
              <span style="font-size: 12px;color: #999;">{{ a.publishTime }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- end -->
      <!-- 分页 -->
      <div class="demo-pagination-block" style="margin:10px 10px;">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30]"
          :small="true" :disabled="false" :background="false" layout="total, sizes, prev, pager, next, jumper"
          :total="total" @size-change="showData" @current-change="showData" />
      </div>
      <!-- end -->
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { ElMessage } from 'element-plus';
import type { Article } from '@/types';
import articleApi from '@/request/api/articleApi'
import { useRouter } from 'vue-router';
const router = useRouter();
//数据
const currentPage = ref(1)  //当前页
const pageSize = ref(10)  //页大小
const total = ref(0) //返回查询结果总数
const articleList = ref<Article[]>([])  //文章列表
const time = ref('')
const searchCondition = ref({  //搜索条件
  title: '',  //标题
  verificationLevel: null,  //鉴定级别
})
const shortcuts = [
  {
    text: '近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '近三月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
//方法
onBeforeMount(showData)
//展示数据
async function showData() {
  console.log("条件查询", searchCondition.value, '时间', time)
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    title: searchCondition.value.title,
    verificationLevel: searchCondition.value.verificationLevel,
    status: 1,
    begin: time.value[0],
    end: time.value[1],
  }
  let result = await articleApi.page(params)
  articleList.value = result.data.data.rows;
  total.value = result.data.data.total;
}

//清空搜索框数据
function emptySearchCondition() {
  searchCondition.value.title = '';  // 清空标题
  searchCondition.value.verificationLevel = null;  // 清空鉴定级别
  time.value = '';  //清空时间
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
  margin: 10px
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

.part {
  display: inline-block;
  margin: 15px;
}

ul {
  list-style-type: none;
}

li {
  margin: 10px 10px 0 0;
}

ul li:hover {
  cursor: pointer;
}
</style>