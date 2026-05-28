<!-- eslint-disable vue/multi-word-component-names -->

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// je defini mes props envoyées au niveau de l'appel du composant dans HomeView
const props = defineProps(['sort', 'pricemin', 'pricemax', 'title', 'page', 'numOfPages'])

// quand je veux changer de page, je dois transmettre le numero de la page de la balise p sur laquelle j'ai cliqué : num
const changePage = (num) => {
  // je crée un objet copie de mes props que je vais modifier
  const queries = { ...props }

  // Dans ce composant jai envoyé ma query numOfPages en props, mais je n'ai pas besin de cette valeur dans la copie des props que je crée (=dans l'objet queries),  car je n'ai pas besoin de cette infos dans mon url (car router.push reconstruit une url a partir des infos que je lui donne, tout ce qui est envoyé dans mon objet queries sera dans mon url )
  // c'est une info inutile (sauf pour l'affichage dans le template) donc je l'efface pour ne pas qu'elle s'affcihe dans mon url au moment du router.push
  delete queries.numOfPages

  // je veux que la page qui s'affiche soit celle sur laquelle j'ai cliqué
  queries.page = num

  router.push({ name: 'home', query: queries })
}
</script>

<template>
  <section>
    <font-awesome-icon :icon="['fas', 'angle-left']" @click="changePage(page - 1)" v-if="page > 1" />
    <!-- en cliquant sur ce chevron je veux aller sur la page precedente a celle ou je suis maintenant: cad a la valeur de la props page moins 1 -->
    <font-awesome-icon :icon="['fas', 'angle-left']" v-else class="disabled" />
    <div>
      <p v-for="num in numOfPages" :key="num" @click="changePage(num)" :class="{ selected: num === page }">
        {{ num }}
      </p>
      <!-- je boucle sur la valeur de numOfPages, pour afficher Autant de balises p que de pages dans le resultats de ma requete
       Au clic je veux changer mes queries : je declenche une fonction en lui transmettant le numero de lapage que je veux afficher-->
    </div>
    <font-awesome-icon :icon="['fas', 'angle-right']" @click="changePage(page + 1)" v-if="page < numOfPages" />
    <font-awesome-icon :icon="['fas', 'angle-right']" v-else class="disabled" />
  </section>
</template>

<style scoped>
section {
  display: flex;
  align-items: center;
  margin-top: 30px;
  gap: 10px;
}

section > div {
  display: flex;
}

p {
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  /* border: 1px solid red; */
}

.selected {
  /* color: red; */
  color: white;
  background-color: black;
}

svg {
  cursor: pointer;
}

.disabled {
  color: rgb(197, 195, 195);
  cursor: auto;
}
</style>
