/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    redirect: 'home',
    meta: {
      title: '首页',
      keepAlive: false
    }
  },
  { path: '/home', name: 'home', component: () => import('@/views/home/index') },
  { path: '/farm', name: 'farm', component: () => import('@/views/home/farm') },
  { path: '/bonds', name: 'bonds', component: () => import('@/views/home/bonds') },
  { path: '/boardRoom', name: 'boardRoom', component: () => import('@/views/home/boardRoom') },
  { path: '/farmSelect', name: 'farmSelect', component: () => import('@/views/home/farmSelect') },
]
