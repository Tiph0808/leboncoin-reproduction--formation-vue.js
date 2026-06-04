import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'

import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faSearch,
  faSignOutAlt,
  faCircle,
  faMapMarkerAlt,
  faCheckDouble,
  faChevronLeft,
  faChevronRight,
  faArrowRight,
  faAngleLeft,
  faAngleRight,
  faCamera,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'

import {
  faSquarePlus,
  faUser,
  faHeart,
  faClock,
  faEye,
  faEyeSlash,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons'

library.add(
  faSearch,
  faUser,
  faSquarePlus,
  faSignOutAlt,
  faUser,
  faCircle,
  faHeart,
  faMapMarkerAlt,
  faClock,
  faCheckDouble,
  faChevronLeft,
  faChevronRight,
  faEye,
  faEyeSlash,
  faArrowRight,
  faAngleLeft,
  faAngleRight,
  faCamera,
  faCheck,
  faTrashCan,
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(VueCookies)

// J'initialise mam ref qui contiendra plus tard les infos de connexion envoyées par login ou signup (le token (jwt) et le name)
// je l'initialise a null ou a la valeur de moncookie si il y en a un de crée auparavant
const userInfos = ref(VueCookies.get('userInfos') || null)

const changeUserInfos = (infos) => {
  userInfos.value = infos
  // Pour rendre la connexion persistante : Je crée mon cookie avec ces infos
  VueCookies.set('userInfos', infos)
}

app.provide('GlobalStore', {
  userInfos: userInfos,
  changeUserInfos: changeUserInfos,
})

app.mount('#app') // tjs en dernier!
