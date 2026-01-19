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
      path: '/offers/:id',
      name: 'offer',
      props: true,
      component: () => import('../views/OfferView.vue'), // fonction avec return implicite, pas besoin des accolades
    },
  ],
})

export default router
