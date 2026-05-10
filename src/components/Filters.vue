<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-dupe-keys -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// FILTERS ---- Correction :
// Je recupére mes props envoyé par le parent HomeView :
// ( les querys sont donc passées en props de index.js à homeView, puis de HomeView à son enfant Filters)
const props = defineProps(['sort', 'pricemin', 'pricemax', 'title', 'page'])
console.log(props) // affiche dans la console un objet avec les clés pricemin, pricemax, sort, title, page

// Création des refs
// Ces infos sont les valeurs que l'on voudra mettre dans les QUERIES de notre URL
// Ces queries ont va les recupérer en props
// je leur donne comme valeur initiale la valeur des props que j'ai recupérer
const priceMin = ref(props.pricemin)
const priceMax = ref(props.pricemax)
const sort = ref(props.sort)

// RMQ : pourquoi l'Ajout du watcheffect
// Quand l'URL change, les PROPS changent. Par exemple, au click sur le logo je reinitialise mon URL donc les props changent. Ce watcheffect permet de "surveiller" ça. si les props changent, wathceffect met a jour les refs locales qui dependent de la valeurs des props.
// De ce fait les inputs afficheront tjs les bonnes valeurs ( et se viderobnt si on click sur le logo leboncoin)
watchEffect(() => {
  priceMin.value = props.pricemin
  priceMax.value = props.pricemax
  sort.value = props.sort
})


const router = useRouter()

// Je declare la fonction qui sera déclenchée à la soumission de mon formulaire :
const handleSubmit = () => {
  // je commence par faire une copie de mes props dans un nouvel objet queries
  const queries = { ...props }
  // si jai rempli qq chose dans les input je veux ajouter la clé pricemin à mes queries (ou la modifier, dans les 2 cas c'est la meme ligne de code (query.cléàAjouter/Modifier = valeur de l'input)
  // si le champ est vide alors je veux effacer cette query de mon url
  // donc je dois effacer la clé correspondante dans le nouvel'objet queries que jai crée
  if (priceMin.value) {
    queries.pricemin = priceMin.value
  } else {
    delete queries.pricemin
  }
  if (priceMax.value) {
    queries.pricemax = priceMax.value
  } else {
    delete queries.pricemax
  }
  if (sort.value) {
    queries.sort = sort.value
  } else {
    delete queries.sort
  }
  // Penser a mettre la page a un
  // de cette facon si on change certains filtres de notre recherche on obtiendra tjs la premiere page des resultats
  queries.page = 1

  router.push({ name: 'home', query: queries }) // je veuxx acceder a la route 'home' en lui transmettant une clé query: avec toutes les modifications faites dans ce composant filters
}

// // My way :

// // Je defini mon evenement: a la soumission du form les infos sont envoyées au composant parent
// const emit = defineEmits({
//   'change-filters': (payload) => {
//     if (typeof payload.priceMin === 'number' && typeof payload.priceMax === 'number') {
//       return true
//     } else {
//       return false
//     }
//   }
// })
// // J'emet mon evenement
// const sendFilters = () => emit('change-filters', {
//   priceMin: parseInt(priceMin.value),
//   priceMax: parseInt(priceMax.value),
//   sortOrder: sortOrder.value
// })
</script>

<template>
  <!-- <form @submit.prevent="sendFilters"> -->
  <form @submit.prevent="handleSubmit">
    <div>
      <p>Prix</p>
      <div class="priceBloc">
        <div>
          <input type="number" name="priceMin" id="priceMin" placeholder="Minimum" min="0" v-model="priceMin" />
          <!-- RMQ : On rajoutte l'attribut min pour ne pas autoriser que la valeur soit en dessous de zero -->
          <label for="PriceMin">€</label>
        </div>
        <div>
          <input type="number" name="priceMax" id="priceMax" placeholder="Maximum" :min="priceMin" v-model="priceMax" />
          <!-- RMQ : On rajoutte l'attribut min , avec la directive v-bind, pour que cette valeur ne soit jamais inf a celle de priceMin entrée précedemment -->
          <label for="PriceMax">€</label>
        </div>
      </div>

      <!--My Way : <div>
        <label for="asc">Prix croissants<input type="radio" id="asc" name="priceSort" value="asc"
            v-model="sortOrder"></label>
        <label for="desc">Prix décroissants<input type="radio" id="desc" name="priceSort" value="desc"
            v-model="sortOrder"></label>
        <label for="none">Pas de tri<input type="radio" id="none" name="priceSort" value="" v-model="sortOrder"></label>
      </div> -->
    </div>

    <div class="sortBloc">
      <p>Tri</p>
      <div>
        <!-- Pour trier par prix croissants/décroissants, je dois rajouter cette syntaxe en query a mon url : sort[0]=price:asc ou desc , donc je donne price:asc ou price:desc comme value a mes inputs radio : cette valeur sera celle de la a ref sort (et si pas de valeur pas de tri)-->
        <label>Prix croissant <input type="radio" value="price:asc" id="priceAsc" v-model="sort" />
        </label>
        <label>Prix décroissant <input type="radio" value="price:desc" id="priceDesc" v-model="sort" />
        </label>
        <label>Pas de tri <input type="radio" value="" id="noSort" v-model="sort" /> </label>
        <!-- RMQ :avec Vue.js, plus besoin de l'attribut name quand on a v-model-->
      </div>
    </div>

    <button>Rechercher</button>
  </form>
</template>

<style scoped>
form {
  /* border: 1px solid blue; */
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

p {
  font-weight: bold;
  margin-bottom: 20px;
}

/*-----Price bloc input-----*/

.priceBloc {
  display: flex;
  gap: 10px;
}

.priceBloc > div {
  height: 43px;
  display: flex;
}

.priceBloc input {
  height: 100%;
  width: 150px;
  border: none;
  border: 1px solid gray;
  border-radius: 15px 0 0 15px;
  padding-left: 10px;
}

.priceBloc input::placeholder {
  font-size: 16px;
}

.priceBloc label {
  border: 1px solid gray;
  height: 100%;
  width: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 15px 15px 0;
  border-left: none;
}

/**------Sort Bloc---- */
.sortBloc > div {
  display: flex;
  gap: 15px;
}

/*---- Button----*/
button {
  background-color: var(--orange);
  border: none;
  padding: 5px 10px 7px 10px;
  border-radius: 10px;
  color: white;
  font-family: inherit;
  font-weight: bold;
  font-size: inherit;
}
</style>
