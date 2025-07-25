import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
// import QuickScan from '../views/QuickScan/QuickScan.vue';
import DesignScan from "../views/DesignScan/DesignScan.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  // {
  //   path: '/quickscan',
  //   name: 'Quickscan',
  //   component: QuickScan
  // },
  {
    path: '/designscan',
    name: 'Designscan',
    component: DesignScan
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
