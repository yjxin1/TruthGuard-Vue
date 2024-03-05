import { createRouter, createWebHashHistory } from 'vue-router'

// 定义 readerView 路由，Reader用户界面
const readerRoute = {
  path: 'reader',
  component: () => import("@/components/Reader.vue"),
  children: [
    {
      path: 'homeReader',
      component: () => import("@/components/Reader/HomeReader.vue"),
    },
    {
      path: 'infoLit',
      component: () => import("@/components/Reader/InfoLit.vue"),
    },
    {
      path: 'seek',
      component: () => import("@/components/Reader/Seek.vue"),
    },
    {
      path: 'submitClue',
      component: () => import("@/components/Reader/SubmitClue.vue"),
    },
    {
      path: 'archives',
      component: () => import("@/components/Reader/Archives.vue"),
    },
  ]
}
const personalRoute = {
  path: 'personal',
  component: () => import('@/components/personal/index.vue'),
  children: [
    {
      path: 'profile',
      component: () => import('@/components/personal/Profile.vue'),
    },
    {
      path: 'changePsw',
      component: () => import('@/components/personal/ChangePsw.vue'),
    },
  ]
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    //login登录界面
    {
      path: '/',
      name: 'loginView',
      component: () => import("../views/LoginView.vue")
    },
    //ReaderView用户界面
    {
      path: '/readerView',
      name: 'readerView',
      component: () => import('../views/ReaderView.vue'),
      redirect: "/readerView/reader",
      children: [
        readerRoute,
        personalRoute,
        {
          path: 'article',
          component: () => import("@/components/Article.vue")
        },
      ]
    },
    //RearView管理界面
    {
      path: '/rearView',
      name: 'rearView',
      component: () => import('../views/RearView.vue'),
      redirect: "/rearView/reader",
      children: [
        readerRoute,
        personalRoute,
        {
          path: 'accManage',
          component: () => import("../components/AccManage.vue")
        },
        {
          path: 'writeArticle',
          component: () => import("@/components/WriteArticle.vue"),
        },
        {
          path: 'articleManage',
          component: () => import("../components/ArticleManage.vue")
        },
        {
          path: 'questionManage',
          component: () => import("../components/QuestionManage.vue")
        },
        {
          path: 'clueManage',
          component: () => import("../components/ClueManage.vue")
        },
        {
          path: 'myArticle',
          component: () => import("../components/MyArticle.vue")
        },
        {
          path: 'article',
          component: () => import("@/components/Article.vue")
        },
      ]
    },
  ]
});

router.beforeEach((to, from, next) => {
  // 在跳转前执行逻辑，比如验证用户身份
  // to: 即将跳转的路由对象
  // from: 当前导航正要离开的路由
  // next: 必须调用该方法来 resolve 这个钩子
  // if (to.path === '/') return next();
  const token = localStorage.getItem('token');
  if (to.path !== '/' && !token) {    // 如果目标路由不是根路径，并且用户未验证，则重定向到登录页
    console.log('hhh0')
    next('/');
  } else {  //否则，继续跳转
    if (to.path === '/rearView/reader') {
      console.log('hhh1')
      next('/rearView/reader/homeReader');
    }
    else if (to.path === '/readerView/reader') {
      console.log('hhh2')
      next('/readerView/reader/homeReader');
    } else {
      next(); //其他情况继续跳转
    }
  }
});
export default router
