<template>
  <div class="login-view">
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon label-width="80px" class="login-ruleForm">
      <h2>欢迎</h2>
      <el-form-item label="用户名" prop="" v-if="!showLoginOrRegister">
        <el-input v-model="ruleForm.nick" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号" prop="">
        <el-input v-model.number="ruleForm.phone" />
      </el-form-item>
      <el-form-item label="密码" prop="">
        <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="" v-if="!showLoginOrRegister">
        <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="年龄" prop="" v-if="!showLoginOrRegister">
        <el-input-number v-model="ruleForm.age" :min="1" :max="10"  />
      </el-form-item>
      <el-form-item label="性别" prop="" v-if="!showLoginOrRegister">
        <el-select v-model="ruleForm.gender" style="width:100px"s>
          <el-option label="男" :value="1">男</el-option>
          <el-option label="女" :value="2">女</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login()" v-if="showLoginOrRegister">登录</el-button>
        <el-button @click="loginOrRegister()" v-if="showLoginOrRegister">申请注册</el-button>
        <el-button type="primary" @click="register()" v-if="!showLoginOrRegister">注册</el-button>
        <el-button type="primary" @click="showLoginOrRegister = 1" v-if="!showLoginOrRegister">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script lang="ts" setup name="LoginView">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useInfoStore } from '@/store';
import loginApi from '@/request/api/loginApi'

const errorMessage = ref('');
const router = useRouter();  //路由实例
const ruleForm = reactive({
  nick: '',
  gender: null,
  age: null,
  phone: '',
  checkPass: '',
  password: '',
})
let showLoginOrRegister = ref(1)
const store = useInfoStore()

async function login() {
  console.log("登录")
  // let result = await axios.post('/api/login', { phone: ruleForm.phone, password: ruleForm.password })
  let result = await loginApi.login({ phone: ruleForm.phone, password: ruleForm.password })
  if (result.data.code) { //登陆成功
    store.login(result.data.data[0], result.data.data[1]);
    console.log("@store.userInfo:", store.userInfo)
    console.log("@storage.token:", localStorage.getItem('token'));
    console.log("@storage.userInfo:", sessionStorage.getItem('userInfo'));
    if (store.userInfo.type === 1) {
      router.push('/readerView');
    } else {
      router.push('/rearView');
    }
  } else {
    ElMessage(result.data.msg);
  }
}
function loginOrRegister() {
  console.log("申请注册")
  if (showLoginOrRegister.value === 1) { showLoginOrRegister.value = 0 }
  else { showLoginOrRegister.value = 1 }
}
async function register() {
  console.log("注册")
  let result = await loginApi.register(ruleForm)
  if (result.data.code == 1) {
    ElMessage.success('注册成功，请继续登录')
    loginOrRegister()
  } else {
    ElMessage.error(result.data.msg)
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-ruleForm {
  border: 2px solid #ccc;
  /* 添加边框样式 */
  padding: 20px;
  /* 可选：添加内边距 */
}
</style>