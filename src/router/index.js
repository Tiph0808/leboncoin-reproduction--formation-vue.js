import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '@/views/SignupView.vue'
import LoginView from '@/views/LoginView.vue'

import { inject } from 'vue'
import NotFoundView from '@/views/NotFoundView.vue'

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
        // console.log(route) // montre toutes les infos de ma route

        // index.js est le chef d'orchestre des URLS
        // Son role ici : lire les querys params de l'URL et les transformer en props pour les envoyer a HomeView
        // Circuit complet : ( + Voir schema grand cahier!)
        // 1- l'utilisateur remplit le formulaire dans filters (fichier filters)
        // 2- grace a router.push({query:queries}), filters réecrit l'url (fichier filters)
        // 3- index.js voit l'url changer et transforme les queries en props pour le transmettre a homeView. (dans ce fichier)
        // 4- homeView reçoit les pros et refait la requête Axios --> les nouvelles offres s'affichent (fichier homeView)
        // 5- homeview retransmet ces props a filters pour que les inputs restent pré-remplis au chargement ( et on retourne au point 1 ;) ) (fichier homeView)
        // (voir etapes dans les fichiers homeview et filters)
        // ce circuit se repète a chaque clic sur rechercher, des que l'url change, tout repart de index.js
        return {
          // FILTERS --- Correction :
          // Dans ce fichier, Je dis à ma route quelles querys elle peut recevoir en props (= on defini les props qui seront transmises a notre route) :
          // Pour cela Je RETOURNE UN OBJET dont les differentes clés deviendront les props de homeView
          // et dont les valeurs sont lues depuis l'URL
          // Ces clés auront pour valeur les queries de la route si elle existent (cad si les inputs de filters ont ete remplies) sinon une cdc vide (qui va ajouter une query vide a l'url ce qui n'aura aucune consequeneces lors de sa lecture)
          page: parseInt(route.query.page) || 1, // parseInt() pour transformer la query qui est une string en nombre entier strict)
          title: route.query.title || '',
          sort: route.query.sort || '',
          pricemin: Number(route.query.pricemin) || '', // IMPORTANT : le typeof query sera tjs string donc ici on veut un number !
          pricemax: Number(route.query.pricemax) || '',
        }
        // ATTENTION : ON DOIT AUSSI DEFINIR CES PROPS dans le composant retourné par cette route (HomeView) sinon vue ne sait pas qu'il doit les recevoir
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
      // "lazy-loaded": long user journey to reach this view, no need to bundle it upfront
      // ( : chargement différé, le parcours est "long" pour acceder a cette page/view (connexion obligatoire, choix annonce, cliquer sur acheter) inutile de charger si l'utilisateur n'y accede pas)
      component: () => import('../views/PaymentView.vue'),
      props: true,
      meta: { requireAuth: true },
    },

    // Creation d'une route pour la page notFound
    // Si l'utilisateur rentre manuellement une url incorrecte ( = il demande une route qui n'existe pas dans mon appli), je le redirige automatiquement vers cette page
    {
      path: '/:catchAll(.*)', // je dis a ma route qu'elle contient un params que je nomme comme je veux : ici catchAll
      // (.*) : expression regulière qui signifie qu'on "récupere" tout
      name: 'notFound',
      component: NotFoundView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requireAuth: true },
    },
    {
      path: '/updateOffer/:id',
      name: 'updateOffer',
      component: () => import('../views/UpdateOfferView.vue'),
      props: true,
      meta: { requireAuth: true },
    },
    {
      path: '/seeOffer/:id',
      name: 'seeOffer',
      component: () => import('../views/SeeOfferView.vue'),
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
    return { name: 'login', query: { redirect: to.name, id: to.params.id } }
  }
  // if (to.meta.requireAuth && !GlobalStore.userInfos.value?.token) {
  //   return { name: 'login', query: { redirect: to.path } }
  // }

  // RMQ : le point d'interrogation apres value signifie "si GloablStore.userInfos.value est null ne cherche pas plus loin sinon va me chercher le token" . Ca evite le plantage car en js on ne peut pas acceder a la propriété d'une valeur nulle ou undefined ( ="je lis mon chemin, si jarrive a value et que c'est une valeur falsy alors jarrete de lire mon chemin")

  // Les query dans ma redirection :
  // redirect : j'ajoute une query a la route sur laquelle je vais etre redirigéée, cette query s'appelle redirect et sa valeur est le nom de la route vers laquelle je me dirigeais avant de devoir login : la route publish, dont les infos sont dans la clé to :)
  // id : si une id est demandé pour la route vers laquelle je voulais naviguer initialement, je veux  qu'il soit pris en compte dans la redirection. jajoute l'id de la route dans ma query. si il ny a pas d'id necessaire pour la route sur laquelle on veut etre redireiger, comme pour la route publish par exemple, to.params.id sera undefined. Une query undefined disparait simplement de l'url. donc pas besoin de ternaire ( ) pour proteger du plantage : ca ne plantera pas :)

  // Pour optimiser mon code j'aurais pu ecrire query : {redirect : to.path}.
  // En effet lorsqu'on console log to on s'apercoit qu'il existe une clé path qui contient le chemin exact de la redirection (nome de la route + params (l'id))
  // Donc plutot que d'envoyer ces deux infos séparément en ajoutant deux clés dans mon objet query, je rajoute seulement une clé redirect et je lui transmet les infos de to.path
  // ATTENTION : Si je fais ca je dois aussi modifié mon fichier login (voir loginView commentaires router.push)
  // PS : J'implemente volontairement la syntaxe precedente pour comprendre la logique :)
})

export default router
