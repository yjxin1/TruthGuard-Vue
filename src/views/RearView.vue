<!-- 管理员界面 -->
<template>
  <div>
    <div class="common-layout">
      <el-container>
        <!-- header部 -->
        <el-header>
          <span style="margin: 0;font-size: 20px;">
            <router-link to="/rearView">FactCheckLab事实核查实验室</router-link>
          </span>
          <el-dropdown class="account" style="cursor: pointer;">
            <div style="font-weight: bold;">
              {{ userNick || 'Account' }}
              <el-icon>
                <CaretBottom />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="toPersonal">用户中心</el-dropdown-item>
                <el-dropdown-item @click="toLogout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <el-container>
          <!-- 侧边栏 -->
          <el-aside>
            <el-row class="tac">
              <el-col>
                <el-menu :default-openeds="['2']" class="el-menu-vertical-demo" router :default-active="$route.path"
                  background-color="#888e93" text-color="#fff" active-text-color="#ffd04b">
                  <!-- index换成路由值 -->
                  <el-menu-item index='/rearView/reader'>
                    <el-icon>
                      <Menu />
                    </el-icon>
                    用户界面
                  </el-menu-item>
                  <!-- 注意一下嵌套路由index的情况 -->
                  <el-sub-menu index="2" v-if="store.userInfo.type === 3">
                    <template #title>
                      <el-icon>
                        <Tools />
                      </el-icon>
                      <span>管理员管理</span>
                    </template>
                    <el-menu-item index="/rearView/accManage">
                      1.账号管理
                    </el-menu-item>
                    <el-menu-item index="/rearView/articleManage">
                      2.文章管理
                    </el-menu-item>
                    <el-menu-item index="/rearView/questionManage">
                      3.题库管理
                    </el-menu-item>
                    <el-menu-item v-if="0">4.其他</el-menu-item>
                  </el-sub-menu>

                  <el-menu-item index="/rearView/clueManage">
                    <el-icon>
                      <Promotion />
                    </el-icon>
                    线索展区
                  </el-menu-item>

                  <el-menu-item index="/rearView/myArticle">
                    <el-icon>
                      <List />
                    </el-icon>
                    我的文章
                  </el-menu-item>

                  <el-menu-item index="/rearView/writeArticle">
                    <el-icon>
                      <Comment />
                    </el-icon>
                    新建文章
                  </el-menu-item>
                  <el-menu-item index="/rearView/modelUse">
                    <el-icon><Management /></el-icon>
                    模型预测
                  </el-menu-item>
                </el-menu>
              </el-col>
            </el-row>
          </el-aside>
          <el-container class="content">
            <!-- main部 -->
            <el-main>
              <router-view></router-view>
            </el-main>

            <!-- footer部 -->
            <el-footer>
              <p style="text-align: center;">制作者：yjx</p>
            </el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, computed } from 'vue'
import { Menu, CaretBottom, Tools, Promotion, Comment, List,Management} from '@element-plus/icons-vue'
import { useInfoStore } from "@/store"
import router from '@/router';
// import {useRoute} from 'vue-router'
const store = useInfoStore();
const userNick = computed(() => store.$state.userInfo.nick);
// const $route = useRoute();
function toPersonal() {
  console.log("跳转个人页面")
  router.push('/rearView/personal')
}
function toLogout() {
  console.log("退出登录")
  store.logout();
  router.push('/')
}
//数据，你好

//方法


</script>

<style scoped>
.common-layout {
  display: flex;
  height: 100vh;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  padding: 10px;
  height: 50px;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(198, 231, 165);
  z-index: 100;
}

.el-aside {
  background-color:#888e93;
  width: 200px;
  margin-left: 0;
  top: 45px;
  position: fixed;
  height: 100%;
}

.content {
  flex: 1;
  display: flex;
  margin-left: 200px;
  margin-top: 45px;
}

.el-main {
  padding: 10px;
}

.el-footer {
  height: 50px;
  padding: 10px;
  background-color: rgba(198, 231, 165);
}

a {
  color: inherit;
  text-decoration: none;
}
</style>