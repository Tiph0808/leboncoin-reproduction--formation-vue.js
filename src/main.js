import './assets/main.css'

import { createApp } from 'vue'
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
} from '@fortawesome/free-solid-svg-icons'
import { faSquarePlus, faUser, faHeart, faClock } from '@fortawesome/free-regular-svg-icons'

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
)

const app = createApp(App)

app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app') // tjs en dernier!
