import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import guard from '@/stores/guards';

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
    {
      path: '/stockDetails/:id',
      name: 'stockDetails',
      component: () => import('../views/StockDetailsView.vue')
    },
    {
      path: '/userPrivate/:id',
      name: 'userPrivate',
      component: () => import('../views/UserPrivateView.vue'),
      beforeEnter: guard
    },
    {
      path: '/watchlistTable/:id',
      name: 'watchlistTable',
      component: () => import('../views/WatchlistTableView.vue'),
      beforeEnter: guard
    },
    {
      path: '/userSettings/:id',
      name: 'userSettings',
      component: () => import('../views/UserSettingsView.vue'),
      beforeEnter: guard
    },
    {
      path: '/descentralizedWallet',
      name: 'descentralizedWallet',
      component: () => import('../views/DescentralizedWalletView.vue')
    },
  ],
})

export default router
