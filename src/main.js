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
} from '@fortawesome/free-solid-svg-icons'

import {
  faSquarePlus,
  faUser,
  faHeart,
  faClock,
  faEye,
  faEyeSlash,
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
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

const savedToken = VueCookies.get('userToken')
const savedName = VueCookies.get('userName')

const userToken = ref(savedToken || '')

const changeToken = (token) => {
  userToken.value = token
  VueCookies.set('userToken', token)
}

const userName = ref(savedName || '')
const changeName = (name) => {
  userName.value = name
  VueCookies.set('userName', name)
}

app.provide('GlobalStore', {
  userToken: userToken,
  userName: userName,

  changeToken: changeToken,
  changeName: changeName,
})

app.use(VueCookies)
app.mount('#app') // tjs en dernier!
