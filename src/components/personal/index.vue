<!-- 个人中心 -->
<template>
  <div>
    <div class="container">
      <div class="top">
        <el-menu router mode="horizontal">
          <el-menu-item :index="`/${$route.path.split('/')[1]}/personal/profile`">个人信息</el-menu-item>
          <el-menu-item :index="`/${$route.path.split('/')[1]}/personal/changePsw`">修改密码</el-menu-item>
        </el-menu>
      </div>
      <div class="bottom">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, computed } from 'vue'
import { useInfoStore } from '@/store';
const store = useInfoStore();

const changePswRoute = computed(() => {
  if (store.userInfo.type === 1) {
    return '/readerView/personal/changePsw';
  } else {
    return '/rearView/personal/changePsw';
  }
});
const profileRoute = computed(() => {
  if (store.userInfo.type === 1) {
    return '/readerView/personal/profile';
  } else {
    return '/rearView/personal/profile';
  }
});

</script>

<style  scoped>
.container {
  display: flex;
  flex-direction: column;
/* 将子元素垂直排列 */
  
  .top {
    flex:1;
  }

  .bottom {
    margin-top: 20px;
    flex: 1;
    align-items: center;
    /* 在水平方向上居中 */
  }
}</style>