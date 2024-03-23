<!-- 读者用户界面 -->
<template>
  <div id="reader">
    <div class="container">
      <div class="top">
        <el-menu router mode="horizontal" :default-active="$route.path" active-text-color="#826516"
         >
          <el-menu-item :index="`/${$route.path.split('/')[1]}/reader/homeReader`">首页</el-menu-item>
          <el-menu-item :index="`/${$route.path.split('/')[1]}/reader/seek`">查证</el-menu-item>
          <el-menu-item :index="`/${$route.path.split('/')[1]}/reader/submitClue`">提交线索</el-menu-item>
          <el-menu-item :index="`/${$route.path.split('/')[1]}/reader/archives`">档案</el-menu-item>
          <el-menu-item :index="`/${$route.path.split('/')[1]}/reader/infoLit`">信息素养能力</el-menu-item>
        </el-menu>
      </div>
      <div class="bottom">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>

</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;

  /* 将子元素垂直排列 */
  .top {
    margin: 0;
  }

  .bottom {
    flex: 1;
    align-items: center;
    /* 在水平方向上居中 */
  }
}
</style>
