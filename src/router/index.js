import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Index'),
      meta: {
        title: '菩提树'
      }
    },
    {
      path: '/teacher',
      name: 'teacher/list',
      component: () => import('@/pages/TeacherList'),
      meta: {
        title: '老师'
      }
    },
    {
      path: '/teacher/detail',
      name: 'teacher/detail',
      component: () => import('@/pages/TeacherDetail'),
      meta: {
        title: '老师介绍'
      }
    },
    {
      path: '/product',
      name: 'product/list',
      component: () => import('@/pages/ProductList'),
      meta: {
        title: '逛逛'
      }
    },
    {
      path: '/product/detail',
      name: 'product/detail',
      component: () => import('@/pages/ProductDetail'),
      meta: {
        title: '逛逛'
      }
    },
    {
      path: '/register',
      name: 'center/register',
      component: () => import('@/pages/members/Register'),
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/myorders',
      name: 'orders/myorders',
      component: () => import('@/pages/members/Orders'),
      meta: {
        title: '订单'
      }
    },
    {
      path: '/mycomments',
      name: '/mycomments',
      component: () => import('@/pages/members/Mycomments'),
      meta: {
        title: '我的评价'
      }
    },
    {
      path: '/list/comments',
      name: '/list/comments',
      component: () => import('@/pages/members/Comments'),
      meta: {
        title: '评价列表'
      }
    },
    {
      path: '/shares',
      name: '/shares',
      component: () => import('@/pages/members/Shares'),
      meta: {
        title: '邀请'
      }
    },
    {
      path: '/income',
      name: '/income',
      component: () => import('@/pages/members/Income'),
      meta: {
        title: '老师收入'
      }
    },
    {
      path: '/myordertaking',
      name: 'orders/myordertaking',
      component: () => import('@/pages/members/Ordertaking'),
      meta: {
        title: '老师订单'
      }
    },
    {
      path: '/chat',
      name: 'member/chat',
      component: () => import('@/pages/members/Chat'),
      meta: {
        title: '聊天'
      }
    },
    {
      path: '/downChatRecord',
      name: 'member/downChatRecord',
      component: () => import('@/pages/members/downChatRecord'),
      meta: {
        title: '下载聊天记录'
      }
    },
    {
      path: '/center',
      name: 'center/index',
      component: () => import('@/pages/members/Center'),
      meta: {
        title: '我的'
      }
    },
    {
      path: '/jifen',
      name: 'member/jifen',
      component: () => import('@/pages/members/jifen'),
      meta: {
        title: '积分'
      }
    },
    {
      path: '/recrult',
      name: 'member/recrult',
      component: () => import('@/pages/members/Recrult'),
      meta: {
        title: '资料'
      }
    },
    {
      path: '/guangguang',
      name: 'member/guangguang',
      component: () => import('@/pages/members/Guangguang'),
      meta: {
        title: '老师逛逛'
      }
    },
    {
      path: '/kefu',
      name: 'kefu',
      component: () => import('@/pages/kefu'),
      meta: {
        title: '联系客服'
      }
    },
    {
      path: '/edit',
      name: '/edit',
      component: () => import('@/pages/members/Editbirthday'),
      meta: {
        title: '资料'
      }
    },
    {
      path: '/service',
      name: 'member/service',
      component: () => import('@/pages/members/Service'),
      meta: {
        title: '老师项目'
      }
    },
    {
      path: '/info',
      name: 'member/info',
      component: () => import('@/pages/members/Info'),
      meta: {
        title: '个人信息'
      }
    },
    {
      path: '/login',
      name: 'center/login',
      component: () => import('@/pages/members/Login'),
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/password',
      name: 'center/password',
      component: () => import('@/pages/members/Password'),
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/scrope',
      name: 'scrope',
      component: () => import('@/components/common/Scrope'),
      meta: {
        title: ''
      }
    },
    {
      path: '/wechatnotify',
      name: 'wechatnotify',
      component: () => import('@/components/common/Wechatnotify'),
      meta: {
        title: '微信订单通知'
      }
    },
    {
      path: '/share',
      name: 'share',
      component: () => import('@/components/common/share'),
      meta: {
        title: ''
      }
    },
    { /* Not Found 路由，必须是最后一个路由 */
      path: '*',
      component: () => import('@/pages/Next'),
      meta: {
        title: '走丢了'
      }
    }
  ]

})
