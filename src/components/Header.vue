<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import BtnPublishOffer from './BtnPublishOffer.vue'
import { RouterLink } from 'vue-router'
import { inject, ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VueCookies from 'vue-cookies'

// j'injecte mon store pour voir acces a ses infos
const GlobalStore = inject('GlobalStore')
const router = useRouter()

// je dois utiliser useRoute pour recuperer les props recues par la route car mon header est en dehors de routerView
// car useRoute donne acces aux differentes queries de ma route (route.query)
const route = useRoute()

const disconnectUser = () => {
  // au clic je supprime les infos: jwt(userToken) et userName du provider :
  GlobalStore.changeUserInfos(null)
  // Et je supprime mon cookie : NE PAS OUBLIER !!
  VueCookies.remove('userInfos')
  // Quand ces valeurs sont à zero je redirige l'utilisateur vers la page d'acceuil:
  router.push({ name: 'home' })
}

const search = ref('') // je cree la ref pour mon input de recherche

// Je met un watcheffect pour que l'input se vide au click sur le logo (Pour les memes raisons que dans Filters.vue : si les props changent, watcheffect mettra a jour la ref locale)
// Idem que ligne 13, le header etant en dehors de RouterView, il ne recoit pas les props directement. Je les recupere en utilisant useRoute()
watchEffect(() => {
  search.value = route.query.title
})

const handleSubmit = () => {
  console.log(search.value)
  console.log(route.query)
  // header est en dehors de RouterView et donc de Homeview, donc je ne peux pas recupérer les props reçues pas la route ( je ne peux pas les passer depuis homeview), a la place jutilise useRoute pour acceder a mes queries

  // Je veux que mon titre soit rajouté dans les querys
  // Donc ici je vais utiliser useRoute pour  acceder aux queries et en faire une copie
  const queries = { ...route.query }

  // je modifie es queries :
  if (search.value) {
    queries.title = search.value
  } else {
    delete queries.title
  }
  // Penser a mettre la page a un
  queries.page = 1
  // je transmet mes queries modifiées à la redirection
  router.push({ name: 'home', query: queries })
}
</script>

<template>
  <header>
    <div class="container">
      <div class="topPart">
        <RouterLink :to="{ name: 'home', query: {} }">
          <!-- je rajoute un objet query vide pour qu'au clic sur le logo, je retrouve ma home page avec TOUS les articles , je veux repartir sur une url sans queries -->
          <img src="../assets/leboncoin1-assets/logo.svg" alt="" />
        </RouterLink>

        <div class="middlePart">
          <BtnPublishOffer />
          <div>
            <form @submit.prevent="handleSubmit">
              <input type="text" id="search" placeholder="Rechercher sur le bon coin" v-model="search" />

              <button><font-awesome-icon :icon="['fas', 'search']" /></button>
            </form>
          </div>
        </div>

        <div class="connectionPart">
          <RouterLink :to="{ name: 'login' }" v-if="!GlobalStore.userInfos.value">
            <!-- si le jwt n'existe pas alors jaffiche cette div -->
            <font-awesome-icon :icon="['far', 'user']" />
            <p>Se connecter</p>
          </RouterLink>

          <div v-else class="disconnectPart">
            <!-- si il existe j'affiche le nom du user et un icon pour se deconnecter : au clic : "le token et le username sont supprimés du fournisseur de dépendance et l'utilisateur est redirigé vers la page d'accueil." -->
            <div>
              <font-awesome-icon :icon="['far', 'user']" />
              <p>{{ GlobalStore.userInfos.value.username }}</p>
            </div>
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" @click="disconnectUser" title="Se déconnecter" />
          </div>
        </div>
      </div>

      <div class="bottomPart">
        <span>Immobilier</span>
        <font-awesome-icon :icon="['fas', 'circle']" />
        <span>Vehicules</span>
        <font-awesome-icon :icon="['fas', 'circle']" />
        <span>Locations de vacances</span>
        <font-awesome-icon :icon="['fas', 'circle']" />
        <span>Emploi</span>
        <font-awesome-icon :icon="['fas', 'circle']" />
        <span>Mode </span>
        <font-awesome-icon :icon="['fas', 'circle']" />
        <span>Maison et Jardin</span>
        <font-awesome-icon :icon="['fas', 'circle']" />
        <span>Famille</span>
        <font-awesome-icon :icon="['fas', 'circle']" />
        <span>Electronique</span>
        <font-awesome-icon :icon="['fas', 'circle']" />
        <span>Loisirs</span>
        <font-awesome-icon :icon="['fas', 'circle']" />

        <RouterLink :to="{ name: 'profile' }" v-if="GlobalStore.userInfos.value">
          <span class="profileLink">Profile</span>
        </RouterLink>

        <span v-else>Autres</span>

      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  height: var(--header-height);
  /* border: 1px solid greenyellow; */
  position: fixed;
  /* rappel : le repere est le premier parent en position relative, si aucun parent n'est en en position relative --> le repere sera le body (parfait dans notre cas) */
  top: 0;
  width: 100%;
  /* on applique ces valeurs sur top bottom et width car en position fixed, le header sort du DOM, il n'a plus la largeur implicite de son parent mais la largeur de son contenu et se positionne par defaut en haut a gauche de la fenetre */
  background-color: white;
  border-bottom: 1px solid var(--grey);
  z-index: 100;
}

/* .container {
  border: 1px solid palevioletred;
} */

.container > div {
  /* border: 1px solid orange; */
  display: flex;
}

img {
  width: 140px;
}

/*---- TOP PART ----- */

.topPart {
  /* border: 1px solid blue; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.middlePart {
  display: flex;
  align-items: center;
  gap: 20px;
}

.middlePart > div > form {
  background-color: var(--light-grey);
  padding: 5px;
  border-radius: 10px;
  display: flex;
  align-items: center;
}

.middlePart > div > form svg {
  background-color: var(--orange);
  padding: 7px;
  border-radius: 5px;
  box-sizing: content-box;
  /* On ajoute box-sizing:content-box car au niveau de l'icone car il faut ecraser la pp box sizing:border-box sinon l'icone est trop petit*/
}

.middlePart > div > form button {
  border: none;
  /* cursor: pointer; */
}

input {
  width: 250px;
  border: none;
  background-color: var(--light-grey);
}

input:focus {
  outline: none;
}

/*--- Connection part ---*/
.connectionPart > a {
  /* border: 1px solid blue; */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.connectionPart svg {
  font-size: 18px;
}

/*---- DisconnexionPart ----*/
.disconnectPart {
  display: flex;
  align-items: center;
  gap: 10px;
}

.disconnectPart > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

/*----- BOTTOM-PART------ */

.bottomPart {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.bottomPart svg {
  font-size: 3px;
}

.bottomPart span {
  font-size: 14px;
}

.bottomPart .profileLink {
  color: var(--orange);
}
</style>

<!-- My way -->
<!-- <template>
  <header>
    <section>
      <RouterLink :to="{ name: 'home' }">
        <img src="../assets/leboncoin1-assets/logo.svg" alt="" />
      </RouterLink>

      <div>
        <button>Deposez une annonce</button>

        <input type="text" placeholder="Rechercher sur leboncoin" />
        <font-awesome-icon :icon="['fas', 'search']" />
      </div>
      <div>
        <font-awesome-icon :icon="['fas', 'user']" />
        <button>Se connecter</button>
      </div>
    </section>

    <section>
      <p>
        Immobilier <span>.</span> Vehicules <span>.</span> Locations de vacances
        <span>.</span> Emploi <span>.</span> Mode <span>.</span> Maison & Jardin
        <span>.</span> Famiile <span>.</span> Electronique <span>.</span> Loisirs
        <span>.</span> Autres
      </p>
    </section>
  </header>
</template>

<style scoped>
section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> -->
