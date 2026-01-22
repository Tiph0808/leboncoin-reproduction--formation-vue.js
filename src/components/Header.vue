<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import BtnPublishOffer from './BtnPublishOffer.vue'
import { RouterLink } from 'vue-router'

// import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <div class="container">
      <div class="topPart">
        <RouterLink :to="{ name: 'home' }">
          <img src="../assets/leboncoin1-assets/logo.svg" alt="" />
        </RouterLink>

        <div class="middlePart">
          <BtnPublishOffer />
          <div>
            <input type="text" id="search" placeholder="Rechercher sur le bon coin" />
            <font-awesome-icon :icon="['fas', 'search']" />
          </div>
        </div>

        <div class="connectionPart">
          <div>
            <font-awesome-icon :icon="['far', 'user']" />
            <p>Se connecter</p>
          </div>
          <!-- <font-awesome-icon :icon="['fas', 'sign-out-alt']" /> -->
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
        <span>Autres</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  height: var(--header-height);
  /* border: 1px solid greenyellow; */
  position: fixed; /* rappel : le repere est le premier parent en position relative, si aucun parent n'est en en position relative --> le repere sera le body (parfait dans notre cas) */
  top: 0;
  width: 100%; /* on applique ces valeurs sur top bottom et width car en position fixed, le header sort du DOM, il n'a plus la largeur implicite de son parent mais la largeur de son contenu et se positionne par defaut en haut a gauche de la fenetre */
  background-color: white;
  border-bottom: 1px solid var(--grey);
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

.middlePart > div {
  background-color: var(--light-grey);
  padding: 5px;
  border-radius: 10px;
  display: flex;
}

.middlePart > div svg {
  background-color: var(--orange);
  padding: 7px;
  border-radius: 5px;
  box-sizing: content-box; /* On ajoute box-sizing:content-box car au niveau de l'icone car il faut ecraser la pp box sizing:border-box sinon l'icone est trop petit*/
}

input {
  width: 250px;
  border: none;
  background-color: var(--light-grey);
}

input:focus {
  outline: none;
}

.connectionPart > div {
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
