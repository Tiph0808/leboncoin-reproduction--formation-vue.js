import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'

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

const userToken = ref('')
const changeToken = (token) => {
  userToken.value = token
}

const userName = ref('')
const changeName = (name) => {
  userName.value = name
}

app.provide('GlobalStore', {
  userToken: userToken,
  userName: userName,
  changeToken: changeToken,
  changeName: changeName,
})

app.mount('#app') // tjs en dernier!
