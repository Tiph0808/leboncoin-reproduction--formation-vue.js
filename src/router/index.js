import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '@/views/SignupView.vue'
import LoginView from '@/views/LoginView.vue'

import { inject } from 'vue'

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
          page: parseInt(route.query.page) || 1, // parseInt() poiur transformer la query qui est une string en nombre entier strict)
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
      //chargement asynchrone de la route
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
    {
      path: '/publish',
      name: 'publish',
      // Notre composant doit etre chargé de manière asynchrone (consignes sem 7)
      component: () => import('../views/PublishView.vue'),
      // je dois proteger ma route :
      meta: { requireAuth: true },
    },
    {
      path: '/payment/:id',
      name: 'payment',
      component: () => import('../views/PaymentView.vue'),
      props: true,
      meta: { requireAuth: true },
    },
  ],
})

// J'ajoute mon navigationGuard :
router.beforeEach((to, from) => {
  console.log('to :', to, 'from', from)
  const GlobalStore = inject('GlobalStore')
  // "si la route a un requireAuth true et qu'il n'y a pas de token enregistré"
  if (to.meta.requireAuth && !GlobalStore.userInfos.value?.token) {
    return { name: 'login', query: { redirect: to.name } }
  }
  // RMQ : le point d'interrogation apres value signifie "si GloablStore.userInfos.value est null ne cherche pas plus loin sinon va me chercher le token" . Ca evite le plantage car en js on ne peut pas acceder a la propriété d'une valeur nulle ou undefined ( ="je lis mon chemin, si jarrive a value et que c'est une valeur falsy alors jarrete de lire mon chemin")

  // j'ajoute une query a la route sur laquelle je vais etre redirigéée, cette query s'appelle redirect et sa valeur est le nom de la route vers laquelle je me dirigeait avant de devoir login : la route publish, dont les infos sont dans la clé to :)
})

export default router
