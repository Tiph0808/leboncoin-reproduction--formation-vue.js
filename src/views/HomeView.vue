<script setup>
// Imports packages :
import axios from 'axios'

// Imports méthodes
import { onMounted, ref, watchEffect } from 'vue'

// Imports composants
import OfferCard from '@/components/OfferCard.vue'

import TimeToSell from '@/components/TimeToSell.vue'
import Filters from '@/components/Filters.vue'
import Pagination from '@/components/Pagination.vue'

// FILTERS --- CORRECTION  :
// Je récupère les props qui viennent d'index.js (avant de les transmettre au composant concerné, ici FILTERS)
// je leur donne donc le nom que j'ai choisi dans index.js
// 4- homeView reçoit les pros et refait la requête Axios : les nouvelles offres s'affichent
const props = defineProps(['sort', 'pricemin', 'pricemax', 'title', 'page']) // definies de facon simple : on ne precise pas le typeof, on dit juste qu'on va recevoir des props nommmées comme ca
console.log(props) // affiche dans la console un objet avec les clés pricemin, pricemax,  sort etc..

const offersList = ref([])
// je crée une ref pour ma pagination
// je l'initialise a une page, par defaut
const numOfPages = ref(1)

onMounted(() => {
  // englober ma requete dans un watch effect permet de surveiller les valeurs dynamiques a l'interieur de celle ci et  de redeclencher ma requete si ces valeurs changent :
  watchEffect(async () => {
    try {
      // pour les filtres je dois gerer une combinaison du min et/ou du max : pour cela jai une manip a faire : je cree une variable qui va contenir mon/mes filtres que je vais concatener a l'adresse de ma requete
      let priceFilters = ''

      if (props.pricemax) {
        priceFilters = priceFilters + `&filters[price][$lte]=${props.pricemax}`
      }

      if (props.pricemin) {
        priceFilters = priceFilters + `&filters[price][$gte]=${props.pricemin}`
      }
      console.log('page envoyée:', props.page)
      const { data } = await axios.get(
        // on a populate d'autres clés de l'objet offer qui n'apparaissaient pas par defaut afin d'acceder à toutes les infos (voir complement d'informations/querys => grand cahier)
        `http://localhost:1337/api/offers?populate[0]=picture&populate[1]=owner.avatar${priceFilters}&sort[0]=${props.sort}&filters[title][$containsi]=${props.title}&pagination[page]=${props.page}&pagination[pageSize]=10`,
      )
      console.log('data', data) // infos sur les pages a la clé meta
      // console.log(data.data)
      offersList.value = data.data
      // console.log(offersList.value)

      // Pour mon composant pagination, jai besoin de connaitre le nombre de pages totales du resultat de ma requete (voir pagination ligne 36-39)
      // je bouclerai sur cette donnée pour pouvoir afficher toutes les pages surlesquelles je peux cliquer
      // je transmet a num of pages la valeur de pagecount qui se trouve dans la clé méta de ma reponse
      numOfPages.value = data.meta.pagination.pageCount
    } catch (error) {
      console.log(error.message)
    }
  })
})

// FILTERS my Way :

// const handleSearch = async (payload) => {
//   console.log(payload)
//   try {
//     const { data } = await axios.get(
//       `https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers?populate[0]=pictures&populate[1]=owner.avatar&filters[price][$gte]=${payload.priceMin}&filters[price][$lte]=${payload.priceMax}${payload.sortOrder ? `&sort[0]=price:${payload.sortOrder}` : ''}`, // on a populate d'autres clés de l'objet offer qui n'apparaissaient pas par defaut afin d'acceder à toutes les infos (voir complement d'informations/querys => grand cahier)
//     )
//     console.log(data.data)
//     offersList.value = data.data
//     console.log(offersList.value)
//   } catch (error) {
//     console.log(error.message)
//   }
// }
</script>

<template>
  <main>
    <p v-if="offersList.length === 0" class="container">Loading...</p>
    <div v-else class="container">
      <!--Filters My way  -->
      <!-- <Filters @change-filters="handleSearch" /> -->

      <!-- Je transmet les props à mon composant filter -->
      <!-- Ici je dois leur donner une valeur ! (d'ailleurs cette valeur definira leur typeof si on les as defini de facon simple dans le script) -->
      <!--  5- homeview retransmet ces props a filters pour que les inputs restent pré-remplis au chargement ( et on retourne au point 1 ;) ) -->
      <!-- Syntaxe : a gauche des : JE choisi le nom qui defini les props que Filters doit recevoir , a droite des : entre "" c'est la valeur que homeView a reçu de index.js et qu'elle retransmet à filters -->
      <Filters :sort="sort" :pricemin="pricemin" :pricemax="pricemax" :title="title" :page="page" />
      <!-- RMQ : Je n'oublie pas de transmettre les query title et page a mon composant filters aussi! pour pouvoir applique des filtres de prix tout en gardant le filtre entré dans l'input title du header si il y en a un :)-->
      <p>Des millions de petites annonces et autant d’occasions de se faire plaisir</p>

      <TimeToSell />

      <div class="offersList">
        <OfferCard v-for="offer in offersList" :key="offer.id" :offerInfos="offer" />
      </div>

      <Pagination :sort="sort" :pricemin="pricemin" :pricemax="pricemax" :title="title" :page="page"
        :numOfPages="numOfPages" />
      <!-- ce composant a besoin de la query page mais aussi de toutes les autres! car si je change de page je veux garder mes filtres si jen ai mis !
      pagination aura aussi besoin de l'info nombre total de page numOfPages, recue dans ma requete-->
    </div>
  </main>
</template>


<!-- My way :  -->
<!-- <template>
  <main>
    <p v-if="offersList.length === 0">loading...</p>
    <div v-else>
      <RouterLink
        v-for="offer in offersList"
        :key="offer.id"
        :to="{ name: 'ad', params: { id: offer.id } }"
      >
        <p>{{ offer.attributes.title }}</p>
      </RouterLink>
    </div>
  </main>
</template> -->


<style scoped>
/* main {
  border-top: 1px solid grey;
} */
main {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
}

.container > p {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
}

.offersList {
  /* border: 1px solid green; */
  /* le contenu de offerList quelle qu'il soit prendra la taille de son parent */
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  /* (defini en prenant la mesure sur le modele) */
}
</style>
