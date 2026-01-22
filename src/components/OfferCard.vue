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

// Formated price my way ::
// const formatedPrice = computed(() => {
//   const newPrice = new Intl.NumberFormat('fr-FR').format(props.offerInfos.attributes.price)
//   return newPrice
// })

// correction formation : avec une boucle et une str vide
const formatedPrice = computed(() => {
  const price = props.offerInfos.attributes.price
  // Je transforme le prix en string pour le parcourir
  const priceStr = price.toString()
  // Je crée une nouvelle str vide a reconstituer
  let newStr = ''
  // je bouvcle A L'ENVERS sur priceStr pour remplir newStr
  for (let i = priceStr.length - 1; i >= 0; i--) {
    // = je pars de la fin jusqu'a la position 0, a chq tr je decremente
    // ma conditon : est ce que je suis au troiseieme tour? est ce que je suis au 3eme caractere en partant de la fin?
    if (i === priceStr.length - 4 || i === priceStr.length - 7) {
      // = "quand i s'est decalé de 3 positions par rapport a sa position initiale (donc (priceStr.length - 1) - 3 --> priceStr.length - 4), on met un espace" , pareil pour la position 6
      newStr = priceStr[i] + ' ' + newStr // : on place le nouveau caractere avant
    } else {
      newStr = priceStr[i] + newStr
    }
  }
  return newStr
})

// // correction avec une boucle my way  :
// const formatedPrice = computed(() => {
//   const price = props.offerInfos.attributes.price
//   //transformer le prix en string pour pouvoir la parcourir:
//   const priceStr = price.toString()
//   // on initialise une str vide pour en reconstruire une nouvelle avec des espaces la ou il faut
//   let newStr = ''
//   // on initialise aussi un compteur a 0 que l'on incremente a chaque fois que ma boucle avance (en l'occurence ici, elle recule), pour pouvoir executer une action de facon cyclique ("tous les 3 chiffres je veux un espace")
//   let counter = 0
//   // on genere une boucle inversée qui part de la fin vers le debut de la string et on va reconstiture une nouvelle str a l'envers puisque la boucle est a l'envers (en placant donc le nouveau caractere avant l'ancien et non apres)
//   // et tous les 3 chiffres, càd quand notre counter est egal a 3 :  on insere un espace avant de mettre le chiffre suivant, puis on reinitialise notre counter (-> cycle : pour que l'action se repete)
//   for (let i = priceStr.length - 1; i >= 0; i--) {
//     if (counter === 3) {
//       newStr = priceStr[i] + ' ' + newStr
//       counter = 1
//       //puis on reinitialise notre compteur a 1. Pourquoi 1? parce que le 4eme chiffre s'est ajouté avant l'espace et qu'il est donc le premier de la prochaine serie de 3
//     } else {
//       // dans tous les autres cas
//       newStr = priceStr[i] + newStr
//       //console.log(newStr)
//       counter++ // on incremente le compteur a chaque tour
//     }
//   }
//   return newStr
// })
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
