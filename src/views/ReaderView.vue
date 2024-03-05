<!-- 用户界面 -->
<template>
    <div>
        <div class="common-layout">
            <el-container>
                <!-- header部 -->
                <el-header>
                    <span style="margin: 0;font-size: 20px;">
                        <router-link to="/readerView/reader">FactCheckLab事实核查实验室</router-link>
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
                <el-container class="content">
                    <!-- main部 -->
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                    <!-- end -->
                    <!-- footer部 -->
                    <el-footer>
                        <p style="text-align: center;">制作者：yjx</p>
                    </el-footer>
                    <!-- end -->
                </el-container>

            </el-container>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, computed } from 'vue'
import { Menu, CaretBottom, Tools, Promotion, Comment, List } from '@element-plus/icons-vue'
import { useInfoStore } from "@/store"
import router from '@/router';
const store = useInfoStore();
const userNick = computed(() => store.$state.userInfo.nick);

onMounted(()=>{
    router.push('/readerView/reader')
})

function toPersonal() {
    console.log("跳转个人页面")
    router.push('/readerView/personal')
}
function toLogout() {
    console.log("退出登录")
    store.logout();
    router.push('/')
}

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

.content {
    flex: 1;
    display: flex;
    margin-left: 0;
    margin-top: 45px;
}

.el-main {
    flex: 1;
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