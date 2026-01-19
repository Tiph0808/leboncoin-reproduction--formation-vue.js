<script setup>
// Imports packages :
import axios from 'axios'

// Imports méthodes
import { onMounted, ref } from 'vue'

// Imports composants
import OfferCard from '@/components/OfferCard.vue'

import TimeToSell from '@/components/TimeToSell.vue'

const offersList = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers?populate[0]=pictures&populate[1]=owner.avatar`, // on a populate d'autres clés de l'objet offer qui n'apparaissaient pas par defaut afin d'acceder à toutes les infos (voir complement d'informations/querys => grand cahier)
    )
    console.log(data.data)
    offersList.value = data.data
    console.log(offersList.value)
  } catch (error) {
    console.log(error.message)
  }
})
</script>

<template>
  <main>
    <p v-if="offersList.length === 0" class="container">Loading...</p>
    <div v-else class="container">
      <p>Des millions de petites annonces et autant d’occasions de se faire plaisir</p>

      <TimeToSell />

      <div class="offersList">
        <OfferCard v-for="offer in offersList" :key="offer.id" :offerInfos="offer" />
      </div>
    </div>
  </main>
</template>

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
  /* border: 1px solid red; */
  display: flex;
  flex-wrap: wrap;
  gap: 15px; /* (defini en prenant la mesure sur le modele) */
}
</style>

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
