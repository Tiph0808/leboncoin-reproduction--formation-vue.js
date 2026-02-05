<script setup>
import { onMounted, ref, computed } from 'vue'

import axios from 'axios'
import { useCycleList } from '@vueuse/core'

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
    // console.log(offerInfos.value)
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

// Correction Formation : (que je n'ai pas vraiment comprise)
const cycleList = computed(() => {
  //si on a notre tableau d'images on utilise useCycleList sinon on renvoie un objet vide (pourquoi un obj vide?? )
  if (pictures.value) {
    //on utilise la methode useCycle List (que l'on a du importer) combinée avec computed, car le tableau dimages est une valeur qui change selon l'article
    // (RMQ : les explications de la correction qui suivent ne me permettent pas de comprendre ce que l'on a fait et pourquoi...)
    // je transmet a useCycleList mon tableau, cette methode va nous renvoyer un objet (et comment on sait ca???) , je stocke ce que retourne cette methode dans une variable dont je destructure les clés state prev et next (????)
    const { state, next, prev } = useCycleList(pictures.value)
    return { state, next, prev }
  } else {
    return {}
  }
})
</script>

<template>
  <main>
    <p v-if="offerInfos === null">Loading...</p>
    <div v-else class="container">
      <div class="leftColumn">
        <div class="carrousel">
          <!-- <img :src="offerInfos.attributes.pictures.data[0].attributes.url" alt="" /> -->
          <!-- <p>{{ cycleList }}</p> = s'affiche un objet avec une clé state qui elle meme est un objet, notre image se trouve à la clé attributes.url : -->

          <font-awesome-icon
            :icon="['fas', 'chevron-left']"
            @click="cycleList.prev()"
            v-if="pictures?.length > 1"
          />
          <!--"au clic je veux utiliser l'une des methodes fournies renvoyées par computed , je pars de cycleList et je  fais appel a la methode prev
          je veux aussi que mes icones s'affichent uniquement si il y a plus d une photo dans mon tableau
          attention : si il ny a aucune photo, que le tab n'existe pas le .length va faire crasher, donc on rajoute une securite en iserant un ? juste apres le l'endroit ou est censé se trouve le tabealu de photos : ici pictures?.length = evite le crash  ar stop la lecture du code si la la valeur recherchée n'existe pas-->
          <img :src="cycleList.state.value.attributes.url" alt="" />
          <!-- la valeur "active" de notre img est dans state -->
          <font-awesome-icon
            :icon="['fas', 'chevron-right']"
            @click="cycleList.next()"
            v-if="pictures?.length > 1"
          />
        </div>
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

.carrousel {
  display: flex;
  align-items: center;
}
.carrousel svg {
  font-size: 20px;
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
