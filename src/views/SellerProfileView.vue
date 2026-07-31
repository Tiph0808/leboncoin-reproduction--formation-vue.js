<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import OfferCard from '@/components/OfferCard.vue'

const props = defineProps({
  // sellerId arrive en String meme si cest un number car cest une props transmise via une route
  sellerId: {
    type: String,
    required: true
  }
})

// Creation de ma ref stocker les offres reçues lors de la requete
const offersList = ref([])


// Requete au montage du composant
// ATTENTION : même populate que pour le requete de homeView car offerCard réutilisé ici aura besoin de ces champs pour s'afficher correctement : on veut la picture de l'offer et l'avatar de l'owner
// + RAJOUTER un filtre pour recuperer les offres d'un vendeur précis
onMounted(async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/offers?populate[0]=picture&populate[1]=owner.avatar&filters[owner][id][$eq]=${props.sellerId} `)
    console.log(data)
    offersList.value = data.data
    console.log(offersList.value)
  } catch (error) {
    console.log("catch offers list : ", error.message)
  }
})

</script>


<template>
  <main>
    <p v-if="!offersList.length">Loading...</p>
    <!-- Pour eviter le bug du au chargement -->

    <div v-else class="container">

      <div class="owner">

        <div>
          <!-- Avatar et username recupérés une seule fois via offersList[0] puisque toutes les offres partagent le meme owner  :) -->
          <img v-if="offersList[0].attributes.owner.data.attributes.avatar.data"
            :src="offersList[0].attributes.owner.data.attributes.avatar.data.attributes.url" alt="" />
          <img v-else src="../assets/leboncoin1-assets/user.jpg" alt="">

          <div>
            <p>{{ offersList[0].attributes.owner.data.attributes.username }}</p>
            <p class="identity">
              <font-awesome-icon :icon="['fas', 'check-double']" /> Pièce d’identité vérifiée
            </p>
            <p><font-awesome-icon :icon="['far', 'clock']" /> Répond généralement en 1 heure</p>
          </div>

        </div>
      </div>

      <div class="offersList">
        <OfferCard v-for="offer in offersList" :key="offer.id" :offerInfos="offer" :showOwner="false" />
      </div>

    </div>
  </main>
</template>


<style scoped>
.container {
  padding: 30px 0px 30px 0px;
}

.owner {
  margin-bottom: 50px;
}

.owner > div {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.owner > div > div {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.owner img {
  height: 80px;
  width: 80px;
  border-radius: 50%;
}


.owner > div p:first-child {
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
}

.identity {
  color: var(--brown);
  background-color: var(--light-coral);
  font-size: 12px;
  padding: 5px;
  border-radius: 10px;
  width: fit-content;
  /* margin-bottom: 20px; */
}

.identity + p {
  /* cible la balise p JUSTE APRES l'element avec la classe identity */
  font-size: 14px;
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
