<script setup>
import { onMounted, ref, computed } from 'vue'

import axios from 'axios'
// import { useCycleList } from '@vueuse/core'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

console.log('id >>>', props.id)

const offerInfos = ref(null)
const pictures = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers/${props.id}?populate[0]=pictures&populate[1]=owner.avatar`,
    )
    // console.log(
    //   'Response OfferView >>> ',
    //   data.data.attributes.owner.data.attributes.avatar.data.attributes.url,
    // )
    // on utilise ce console log pour verifier l'endroit où on recupere les infos specifiques (que l'on veut afficher) dans l'objet recu (data) En effet, on a populate notre requete avec des querys pour pouvoir acceder a toutes les clés qui contiennent les infos necessaires (mais qui sont masquées par defaut par strapi) : l'objet recu contient maintenant une multitude des clés et "sous clés" --> les chemins risquent d'etre longs pour acceder a la clé concernée! c'est + safe de verifier qu on est au bon endroit avec le console log avant de mettre l'info dans le template :) ( où on remplacera data.data par offerInfos car on va lui attribuer cette valeur)

    offerInfos.value = data.data
    pictures.value = data.data.attributes.pictures.data
    console.log(offerInfos.value)
    console.log(pictures.value)
  } catch (error) {
    console.log('cactch OfferView >>> ', error.message)
  }
})

const price = computed(() => {
  const newPrice = new Intl.NumberFormat('fr-FR').format(offerInfos.value.attributes.price)
  return newPrice
})

const FormatedDate = computed(() => {
  return offerInfos.value.attributes.publishedAt.split('T')[0].split('-').reverse().join('/')
})

// console.log(price)
</script>

<template>
  <main>
    <p v-if="offerInfos === null">Loading...</p>
    <div v-else class="container">
      <div class="leftColumn">
        <img :src="offerInfos.attributes.pictures.data[0].attributes.url" alt="" />

        <p class="title">{{ offerInfos.attributes.title }}</p>
        <p class="price">{{ price }} €</p>
        <!-- <p>{{ offerInfos.attributes.publishedAt }}</p> -->
        <p class="date">{{ FormatedDate }}</p>

        <h2>Description</h2>

        <p>{{ offerInfos.attributes.description }}</p>

        <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
        <span>Agon-Coutainville (50230)</span>
      </div>
      <div class="rightColumn">
        <div class="owner">
          <div>
            <img
              v-if="offerInfos.attributes.owner.data.attributes.avatar.data"
              :src="offerInfos.attributes.owner.data.attributes.avatar.data.attributes.url"
              alt=""
            />

            <p>{{ offerInfos.attributes.owner.data.attributes.username }}</p>
          </div>

          <p class="identity">
            <font-awesome-icon :icon="['fas', 'check-double']" /> Pièce d’identité vérifiée
          </p>
          <p><font-awesome-icon :icon="['far', 'clock']" /> Répond généralement en 1 heure</p>
        </div>

        <div class="btnPart">
          <button>Acheter</button>
          <button>Message</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
}

.container {
  display: flex;
  gap: 20px;
}

/*---- LEFT SIDE ----*/
.leftColumn {
  /* border: 1px solid salmon; */
  width: 65%;
}

.leftColumn img {
  width: 100%;
  height: 350px;
  object-fit: contain;
  margin-bottom: 30px;
}

.title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 30px;
}

.price {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.date {
  font-size: 12px;
  color: var(--grey);
  margin-bottom: 40px;
}

h2 {
  border-top: 1px solid var(--light-grey);
  margin-bottom: 20px;
  padding-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

h2 + p {
  /* on cible la 1ere balise p apres le h2 */
  padding-bottom: 50px;
  border-bottom: 1px solid var(--light-grey);
  margin-bottom: 20px;
}

/*----- RIGHT SIDE -----*/

.rightColumn {
  /* border: 1px solid salmon; */
  width: 35%;
  height: 365px;
  padding: 20px;
  border: 2px solid var(--light-grey);
  /* box-shadow: 0 0 3px grey; */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.owner > div {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.owner img {
  height: 65px;
  width: 65px;
  border-radius: 50%;
}
.owner > div p {
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
  margin-bottom: 20px;
}

.identity + p {
  /* cible la balise p JUSTE APRES l'element avec la classe identity */
  font-size: 14px;
}

hr {
  width: 90%;
  border: 1px solid var(--light-grey);
}

.btnPart {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid var(--light-grey);
}

button {
  background-color: var(--orange);
  color: white;
  font-weight: bold;
  padding: 10px 0;
  border: none;
  border-radius: 10px;
  font-size: inherit;
}

button:last-child {
  background-color: var(--blue-navy);
}
</style>
