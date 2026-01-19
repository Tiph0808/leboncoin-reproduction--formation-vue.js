<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
const props = defineProps({
  offerInfos: Object,
})
// console.log(props.offerInfos)
// console.log(props.offerInfos.attributes.pictures.data[0].attributes.url)
// on utilise ce console log pour verifier l'endroit où on recupere les infos specifiques (que l'on veut afficher) dans l'objet recu (offerInfos). En effet, on a populate notre requete avec des querys ( dans le fichier HomeView.vue, ligne 16/17) pour pouvoir acceder a toutes les infos necessaires : l'objet recu contient maintenant une multitude des clés et "sous clés" --> les chemins risquent d'etre longs pour acceder a la clé concernée! c'est + safe de verifier qu on est au bon endroit avec le console log avant de mettre l'info dans le template :)

// console.log(props.offerInfos.attributes.price)

// ma methode pour formater la date :
// const formatedDate = computed(() => {
//   const date = new Date(props.offerInfos.attributes.publishedAt).toLocaleDateString('fr')
//   return date
// })
// console.log(formatedDate.value)

// correction :
const formatedDate = computed(() => {
  // return typeof props.offerInfos.attributes.publishedAt
  // on check le typeOf props.attributes.publishedAt: c'est une string on peut donc la découper en lui appliquant la methode split pour obtenir un tableau. on veut aficher le premier element mais apres modification :
  // le premier element sera YYY-MM-DD on veut DD/MM/YYY
  return props.offerInfos.attributes.publishedAt.split('T')[0].split('-').reverse().join('/')
})
// remarque : un peu laborieux, je prefere ma methode, + clean

const formatedPrice = computed(() => {
  const newPrice = new Intl.NumberFormat('fr-FR').format(props.offerInfos.attributes.price)
  return newPrice
})

// console.log(offerPrice.value)
</script>

<template>
  <RouterLink :to="{ name: 'offer', params: { id: offerInfos.id } }" class="offerCard">
    <div>
      <div class="ownerPart">
        <img
          class="avatar"
          v-if="offerInfos.attributes.owner.data.attributes.avatar.data"
          :src="offerInfos.attributes.owner.data.attributes.avatar.data.attributes.url"
          alt=""
        />
        <p>{{ offerInfos.attributes.owner.data.attributes.username }}</p>
      </div>

      <img :src="offerInfos.attributes.pictures.data[0].attributes.url" alt="" />

      <p>{{ offerInfos.attributes.title }}</p>
      <!-- <p>{{ offerInfos.attributes.price }} €</p> -->
      <p>{{ formatedPrice }} €</p>

      <div class="bottomPart">
        <!-- <p>{{ offerInfos.attributes.publishedAt }}</p> : remplacé par nouveau format -->
        <p class="date">{{ formatedDate }}</p>

        <font-awesome-icon :icon="['far', 'heart']" />
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.offerCard {
  /* border: 1px solid red; */
  /* il doit y avoir 5 cartes par lignes et doivent etre separees de 15px d'apres les dimensions prises sur le modele , donc on calcule la width :*/
  width: calc((100% - 60px) / 5);
}

/*--- OWNER PART---*/
.ownerPart {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  height: 30px; /* on donne une hauteur pour avoir le meme rendu visuel qu il y ait un avatar ou pas */
}

.avatar {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  object-fit: cover;
}
.ownerPart p {
  font-weight: bold;
  font-size: 14px;
}

/*----- CARD ------*/

.offerCard > div > img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.offerCard > div > p {
  font-weight: bold;
  margin-bottom: 10px;
}

.bottomPart {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--grey);
  margin-top: 35px;
}

.bottomPart p {
  font-size: 12px;
}
</style>
