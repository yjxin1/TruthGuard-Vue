<!--  -->
<template>
  <div>
    <el-form ref="formRef" :model="userInfo" label-width="80px" label-position="left">
      <el-form-item label="用户名">
        <label>{{ userInfo.nick }}</label>
      </el-form-item>
      <el-form-item label="手机">
        <label>{{ userInfo.phone }}</label>
      </el-form-item>
      <el-form-item label="密码">
        <label>{{ userInfo.password }}</label>
      </el-form-item>
      <el-form-item label="性别">
        <label>{{ userInfo.gender }}</label>
      </el-form-item>
      <el-form-item label="年龄">
        <label>{{ userInfo.age }}</label>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import type { UserInfo } from '@/types'
import { useInfoStore } from "@/store"
//数据
const store = useInfoStore();
const userInfo = store.$state.userInfo;
//方法

</script>

<style scoped>
.el-form{
  padding:0px 20px;
}
</style>