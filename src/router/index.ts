import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cryptoTable',
      name: 'cryptoTable',
      component: () => import('../views/CryptoTableView.vue')
    },
    {
      path: '/stockTable',
      name: 'stockTable',
      component: () => import('../views/StockTableView.vue')
    },
    {
      path: '/cryptoDetails/:id',
      name: 'cryptoDetails',
      component: () => import('../views/CryptoDetailsView.vue')
    },
  ],
})

export default router
