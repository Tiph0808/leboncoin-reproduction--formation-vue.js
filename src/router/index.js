import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '@/views/SignupView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // on configure cette route pour lui indiquer qu'elle peut recevoir des querys en props
      // Pour ça on ajoute la clé props et on lui donne comme valeur une fonction qui nous donne accès à route et à ses differentes queries (route.queries) (= à l'objet route et ses differentes clés/infos)
      props: (route) => {
        // console.log(route)
        return {
          // FILTERS --- Correction :
          // Je dis à ma route quelles querys elle peut recevoir en props  :
          // (= on defini les props qui seront transmises a notre route)
          // Je veux retourner un objet avec differentes clés, contenant les differentes queries possibles
          // Ces clés auront pour valeur les queries de la route si elle existent sinon une cdc vide (qui ajouter une query vide a l'url)
          page: parseInt(route.query.page) || 1,
          title: route.query.title || '',
          sort: route.query.sort || '',
          pricemin: Number(route.query.pricemin) || '', // IMPORTANT : le typeof query sera tjs string donc ici on veut un number !
          pricemax: Number(route.query.pricemax) || '',
        }
        // ON DOIT AUSSI DEFINIR CES PROPS dans le composant retourné par cette route (HomeView)
      },
    },
    {
      path: '/offers/:id',
      name: 'offer',
      props: true,
      component: () => import('../views/OfferView.vue'), // fonction avec return implicite, pas besoin des accolades
    },

    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
