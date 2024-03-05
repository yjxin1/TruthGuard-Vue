<!--  -->
<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px" class="form">
      <el-form-item label="当前密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="当前密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="npassword">
        <el-input v-model="form.npassword" type="password" placeholder="新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="cfpassword">
        <el-input v-model="form.cfpassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="w100p" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted,computed } from 'vue'
import { useInfoStore } from '@/store';
import userApi from '@/request/api/userApi';
import { ElMessage } from 'element-plus'

//数据
const store = useInfoStore();
const formRef = ref();
const form = reactive({
  password: '',
  npassword: '',
  cfpassword: ''
})
const rules = computed(() => {
  return {
    password: {
      required: true,
      min: 1,
      message: '密码不能小于1位',
      trigger: "blur",
    },
    npassword: [
      {
        required: true,
        min: 1,
        message: '密码不能小于1位',
        trigger: "blur",
      }
    ],
    cfpassword: [
      {
        required: true,
        min: 1,
        message: '密码不能小于1位',
        trigger: "blur",
      },
      {
        validator: (rule:any, value:any, callback:any) => {
          if (value !== form.npassword) {
            callback(new Error('两次密码不一致'));
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ]
  }
})
//方法
async function submit(){
  let params={
    phone:store.userInfo.phone,
    psw:form.password,
    newPsw:form.npassword
  }
  let result = await userApi.changePsw(params);
  if(result.data.code==1){
    ElMessage.success("改密成功")
  }else{
    ElMessage.error(result.data.msg)
  }
}
</script>

<style scoped>
.form {
  width: 450px;
}
</style>