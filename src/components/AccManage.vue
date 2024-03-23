<!--  -->
<template>
  <div>
    <!-- 查询这一栏 -->
    <el-row class="mb-1">
      <el-text>昵称</el-text>
      <el-input v-model="searchCondition.nick" placeholder="查询昵称" style="width: 150px" />
      <el-text>电话号</el-text>
      <el-input v-model="searchCondition.phone" placeholder="查询电话号" style="width: 200px" />
      <el-select v-model="searchCondition.type" placeholder="账户类型" style="width: 100px">
        <el-option label="读者" :value="1" />
        <el-option label="核查员" :value="2" />
        <el-option label="管理员" :value="3" />
      </el-select>
      <el-button type="primary" @click="showData">查询</el-button>
      <el-button type="info" @click="emptySearchCondition">清空</el-button>
    </el-row>
    <!-- end查询这一栏 -->

    <!-- 第二栏 -->
    <el-row class="mb-2">
      <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="确认删除" @confirm="deleteSelectedUser"
        @cancel="">
        <template #reference>
          <el-button type="danger">批量删除</el-button>
        </template>
      </el-popconfirm>
      <el-button type="primary" @click="addUser">添加用户</el-button>
    </el-row>
    <!-- end第二栏 -->

    <!-- 数据表格 -->
    <div style="margin:0 20px;">
      <el-table :data="userList" stripe style="width:100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="ID" v-if="false">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="nick"></el-table-column>
        <el-table-column label="电话号" prop="phone"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="性别">
          <template #default="scope">
            <span v-if="scope.row.gender === 1">男</span>
            <span v-else-if="scope.row.gender === 2">女</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄" prop="age"></el-table-column>
        <el-table-column label="账户类型">
          <template #default="scope">
            <span v-if="scope.row.type === 1">读者</span>
            <span v-else-if="scope.row.type === 2">核查员</span>
            <span v-if="scope.row.type === 3">管理员</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click=" editUser(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="0" size="small" type="danger" @click=" deleteUser(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- end数据表格 -->

    <!-- 分页 -->
    <div class="demo-pagination-block" style="margin:10px 10px;">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]"
        :small="true" :disabled="false" :background="false" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="showData" @current-change="showData" />
    </div>
    <!-- end分页 -->

    <!-- 消息提示框，用于编辑表单 -->
    <el-dialog v-model="editDialogVisible" title="编辑用户信息">
      <el-form :model="user">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="user.nick" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="user.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="user.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-input v-model="user.gender" autocomplete="off" />
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="user.age" autocomplete="off" />
        </el-form-item>
        <el-form-item label="账户类型" :label-width="formLabelWidth">
          <el-select v-model="user.type" placeholder="Please select a zone">
            <el-option label="读者" :value="1" />
            <el-option label="核查员" :value="2" />
            <el-option label="管理员" :value="3" />
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
    <!-- end消息提示框 -->

    <!-- 消息提示框，用于添加用户 -->
    <el-dialog v-model="addDialogVisible" title="添加用户" inline="true">
      <el-form :model="user">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="user.nick" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="user.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="user.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-input v-model="user.gender" autocomplete="off" />
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="user.age" autocomplete="off" />
        </el-form-item>
        <el-form-item label="账户类型" :label-width="formLabelWidth">
          <el-select v-model="user.type" placeholder="Please select a zone">
            <el-option label="读者" :value="1" />
            <el-option label="核查员" :value="2" />
            <el-option label="管理员" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addSure()">添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- end消息提示框 -->

  </div>
</template>

<script lang='ts' setup>
import axios from 'axios';
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import userApi from '@/request/api/userApi';
import type { UserInfo } from '@/types';
//数据

const user = ref<UserInfo>({
  id: null,
  nick: null,
  phone: null,
  password: null,
  gender: null,//1男，2女
  age: null,
  type: null, //1读者，2核查员,3管理员
})
const ids = ref<number[]>([]); //多选框存储选中用户的ID，可以批量删除
const formLabelWidth = '100px' //消息提示框的样式，不用管
const editDialogVisible = ref(false)  //编辑用户提示框
const addDialogVisible = ref(false) //添加用户提示框
const userList = ref<UserInfo[]>([])  //存储用户数据的列表
const currentPage = ref(1)  //当前页
const pageSize = ref(10)  //页大小
const total = ref(0) //返回查询结果总数
const searchCondition = ref({  //搜索条件
  nick: '',
  phone: '',
  type: null,
})


//方法
//刷新页面从后端获取数据
onBeforeMount(showData)
async function showData() {
  console.log("条件查询", searchCondition.value)
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    nick: searchCondition.value.nick,
    phone: searchCondition.value.phone,
    type: searchCondition.value.type,
  }
  let result = await userApi.page(params)
  if (result.data.code === 1) {
    console.log('@', result)
    userList.value = result.data.data.rows
    total.value = result.data.data.total
  } else {
    console.log('@', result.data)
    ElMessage("错误信息", result.data.msg);
  }

}
//数据表格编辑按钮
const editUser = (index: number, row: UserInfo) => {
  console.log("编辑用户", index, row)
  user.value = row
  editDialogVisible.value = true
}
//数据表格编辑完成按钮
async function editSure() {
  console.log("弹出编辑表单")
  // let result = await axios.put('/api/user', user.value)
  let result = await userApi.update(user.value)
  editDialogVisible.value = false
  if (result.data.code === 1) {
    console.log('编辑成功')
    ElMessage('编辑成功')
  }
  user.value = { id: null, nick: '', phone: '', password: '', gender: null, age: null, type: 1 }//清空user
}
//数据表格删除按钮
const deleteUser = async (index: number, row: UserInfo) => {
  console.log("删除用户", index, row)
  let result = await axios.delete('/api/user', {
    params: {
      id: row.id,
    }
  })
  if (result.data.code === 1) {
    ElMessage('删除成功')
    showData();
  }
}
//多选
async function handleSelectionChange(selectedRows: any[]) {
  console.log("多选")
  //获取选择的所有用户ID
  ids.value = selectedRows.map(row => row.id);
  console.log(ids)
}
//批量删除用户
async function deleteSelectedUser() {
  // let result = await axios.delete(`/api/user/${ids.value.join(',')}`)
  let result = await userApi.deleteByIds(ids.value)
  if (result.data.code === 1) {
    ElMessage('批量删除成功')
    showData();
  }
}
//添加用户
function addUser() {
  console.log("添加用户")
  user.value = { id: null, nick: '', phone: '', password: '', gender: null, age: null, type: 1 }//清空user
  addDialogVisible.value = true;
}
async function addSure() {
  console.log("确认添加")
  // let result = await axios.post('/api/user', user.value)
  let result = await userApi.add(user.value)
  if (result.data.code === 1) {
    ElMessage('添加成功')
    showData();
    addDialogVisible.value = false;
  }
}


//清空搜索框数据
function emptySearchCondition() {
  searchCondition.value.nick = '',
    searchCondition.value.phone = '',
    searchCondition.value.type = null
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
</style>