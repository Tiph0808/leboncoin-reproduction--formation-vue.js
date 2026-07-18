<script setup>
import { onMounted, ref, inject, computed } from 'vue';
import axios from 'axios';


const GlobalStore = inject('GlobalStore')

const profileInfos = ref(null)

const offers = ref([])

// je cree une nouvelle ref pour stocker mes achats
const purchases = ref([])

// Je cree une ref pour le changement de photo
const newAvatar = ref(null)

// Je crée une ref pour l'affichage de l'input pour changer de nom
const isEditingUsername = ref(false)

// je crée une ref pour mon nouveau nom
const newUsername = ref('')


onMounted(async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${GlobalStore.userInfos.value.id}?populate[0]=offers&populate[1]=avatar&populate[2]=offers.picture&populate[3]=purchases&populate[4]=purchases.picture&populate[5]=offers.buyer`, {
      headers: {
        Authorization: `Bearer ${GlobalStore.userInfos.value.token}`
      }
    })
    console.log('reponse :', data)
    profileInfos.value = data
    offers.value = data.offers
    purchases.value = data.purchases
    console.log(onGoingOffers.value)
    console.log(pastOffers.value)

  } catch (error) {
    console.log('catch ProfileView : ', error.message)
  }
})

// Pour afficher la date de publication correctement jai besoin d'une fonction
const formatedDate = (date) => {
  //console.log("formatedDate reçoit : ", date)
  return date.split('T')[0].split('-').reverse().join('/')
}


// Pour supprimer une offre :
const deleteOffer = async (id) => {
  try {
    const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/offers/${id}`, {
      headers: {
        Authorization: `Bearer ${GlobalStore.userInfos.value.token}`
      }
    })
    console.log('offre effacée : ', data)
    // on filtre le tableau offers pour retirer l'offre supprimée et mettre a jour l'affichage sans recharger la page
    offers.value = offers.value.filter((offer) => offer.id !== id) // Je recrée un nouveau tableau pour l'assigner a ma ref offer
    // methode .filter() =" Parcourt chaque offer du tableau et garde la seulement si son id est different de l'id supprimé"
  } catch (error) {
    console.log('catch error :', error.message)
  }
}


// Pour changer d'avatar
const changeAvatar = async (event) => {
  // Je donne comme valeur a ma ref la photo selectionnee :
  newAvatar.value = event.target.files[0]

  // je crée un Data qui contient la photo a envoyer au back
  const imageFormData = new FormData()

  // J'ajoute mon image à ce formData =
  // le nom files cest la convention strapi pour indiquer que c'est un champ files, strapi saura que c'est un upload
  imageFormData.append('files', newAvatar.value)

  // Je lance ma requete en put pour changer l'avatar de mon user en envoyant mon  nouveau formDAta
  try {
    // Methode en 2 etapes : d'abord on enregistre l'image, ensuite on l'ajoute au user
    // RMQ : on aurait pu faire en une etape et comme dans updateOfferView mais pour mettre a jour un media sur le content-type USERS de strpi ça ne marche pas. Pourquoi? parce que users se comporte differemment des autres content-types (=collections)
    //1ere requete : J'enregistre l'image
    const { data: uploadData } = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, imageFormData, {
      headers: {
        Authorization: `Bearer ${GlobalStore.userInfos.value.token}`
      }
    })
    console.log('image uploadée', uploadData)
    // 2eme requete : J'update mon user avec une requete en put
    // en deuxieme argument, le body de ma requete : ce que jenvoie. je donne une nouvelle valeur à ma clé avatar (nom du champ dans strapi) avec l'id de l'image uploadee : uploadData[0].id
    const { data: dataUser } = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${GlobalStore.userInfos.value.id}`, { avatar: uploadData[0].id },
      // ce que dit cette requete = " pour le user avec cet id, mets à jour le champ avatar avec l'image qui a l'id uploadData[0].id"
      {
        headers: {
          Authorization: `Bearer ${GlobalStore.userInfos.value.token}`
        }
      })
    console.log('reponse user : ', dataUser)

    // Je met a jour profileInfos pour que l'affichage change en réattribuant une nouvelle valeur à la clé avatar de profileInfos :
    // RMQ : c est une ref, donc si sa valaur change Vue "re-render" automatiquement tout ce qu'il y a dans le template.La ref change, l'affichage se met a jour tout seul :) ( sans avoir a recharger la page)
    profileInfos.value.avatar = uploadData[0]


  } catch (error) {
    console.log('catch error message : ', error.message)
  }

}

const changeUsername = async () => {
  const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${GlobalStore.userInfos.value.id}`, { username: newUsername.value }, {
    headers: {
      Authorization: `Bearer ${GlobalStore.userInfos.value.token}`
    }
  })
  console.log("reponse changement updateName :  ", data)
  // Je change la valeur de isEditingUsername pour changer l'affichage et enlever l'input
  isEditingUsername.value = false
  // Je donne comme nouvelle valeur a profileInfos.value.username la valeur que je viens de stocker dans la bdd et qui se trouve dans la reponse data :
  profileInfos.value.username = data.username
  GlobalStore.userInfos.value.username = data.username
}


// jutilise la pp computed pour séparer mes offres : les actives et les offres passées (càd achetée par un autre user : qui contiennent un champ buyer)
// on cree donc une pp computed = nouvelle valeur reactive = onGoingOffers dont le contenu va etre calculé automatiquement à partir de offers (mm chose pour pastOffers) :

// const onGoingOffers = computed(() => {
//   // dans mon computed j'applique la méthode .filters à mon tableau offers (cette methode va parcourir chaque offre, une par une)
//   return offers.value.filter((offer) => {
//     // Pour chaque offre examinee je dois dire a .filters() ce qu il doit faire : pour cela je lui donne une fonction fléchée en argument ("une call-back")
//     // dans cette fonction on regarde si offer.buyer existe ou pas
//     // cette fonction renverra true or false a .filters() qui gardera ou pas l'annonce dans le nouveau tableau qu'elle va retourner
//     if (!offer.buyer) {
//       return true
//     } else {
//       return false
//     }
//   })
// })

// Rq : version syntaxe raccourcie avec return implicite de ma call-back
const onGoingOffers = computed(() => {
  return offers.value.filter((offer) => !offer.buyer)
})

// Même chose pour les offres passées , achetées
const pastOffers = computed(() => {
  return offers.value.filter((offer) => offer.buyer)
})

</script>

<template>

  <main>
    <div class="container">
      <h1>Mon profil</h1>

      <div>
        <h1>Mes infos</h1>

        <div class="profile">

          <div>

            <img v-if="profileInfos?.avatar" :src=profileInfos.avatar.url alt="">
            <img v-else src="../assets/leboncoin1-assets/user.jpg" alt="">
            <label for="newPicture">
              <font-awesome-icon :icon="['fas', 'pen']" class="editAvatarIcon" />
            </label>
            <input type="file" id="newPicture" name="newPicture" @change="changeAvatar">

          </div>

          <div>

            <div v-if="!isEditingUsername" class="username">
              <p><span>Nom : </span> {{ profileInfos?.username }}</p>
              <font-awesome-icon :icon="['fas', 'pen']" class="editNameIcon" @click="isEditingUsername = true" />
            </div>

            <div v-else class="changeUsername">

              <label for="changeName">Modifier mon nom : </label>
              <input type="text" id="changeName" name="changeName" v-model="newUsername" @keyup.enter="changeUsername">
              <!-- RMQ : @keyup.enter est un ecouteur d'evenement qui se declenche lorsqu on appuie sur la touche entrée -->

            </div>

            <div>
              <p><span>E-mail : </span>{{ profileInfos?.email }}</p>
            </div>

            <div v-if="profileInfos">
              <p><span>Member since : </span>{{ formatedDate(profileInfos?.createdAt) }}</p>
            </div>

          </div>

        </div>
      </div>


      <div v-if="offers.length > 0" class="offersBloc">
        <div>
          <h1>Mes annonces en cours</h1>
          <div v-for="offer in onGoingOffers" :key="offer.id" class="offers">
            <RouterLink :to="{ name: 'offer', params: { id: offer.id } }">
              <div>
                <img :src=offer.picture[0].url alt="">
                <!-- pour chaque offre je veux afficher la premiere de ses photos -->
                <p>{{ offer?.title }} <span>(Publiée le : {{ formatedDate(offer?.publishedAt) }})</span></p>

              </div>

            </RouterLink>

            <div>
              <span class="tooltip" data-tooltip="Supprimer cette annonce" @click="deleteOffer(offer.id)">
                <font-awesome-icon :icon="['far', 'trash-can']" />
              </span>
              <RouterLink :to="{ name: 'updateOffer', params: { id: offer.id } }">

                <button class="updateBtn">Modifier mon annonce</button>

              </RouterLink>

            </div>
          </div>
        </div>

        <div v-if="pastOffers.length > 0">
          <h1>Mes annonces passées</h1>
          <div v-for="offer in pastOffers" :key="offer.id" class="offers">

            <div>
              <img :src=offer.picture[0].url alt="">
              <!-- pour chaque offre je veux afficher la premiere de ses photos -->
              <p>{{ offer?.title }} <span>(Publiée le : {{ formatedDate(offer?.publishedAt) }})</span></p>
            </div>

            <div>
              <RouterLink :to="{ name: 'seeOffer', params: { id: offer.id } }">
                <button class="seeAddBtn">Voir mon annonce</button>
              </RouterLink>
              <span class="tooltip" data-tooltip="Supprimer cette annonce" @click="deleteOffer(offer.id)">
                <font-awesome-icon :icon="['far', 'trash-can']" />
              </span>
            </div>

          </div>
        </div>



      </div>
      <div v-else class="noAdd">
        <h1>Mes annonces</h1>
        <p>Aucune annonce enregistrée</p>

      </div>

      <div v-if="purchases.length > 0">

        <h1>Mes achats</h1>
        <div v-for="purchase in purchases" :key="purchase.id" class="offers">
          <div>
            <img :src="purchase.picture[0].url" alt="">
            <p>{{ purchase?.title }}</p>
          </div>
          <div>
            <RouterLink :to="{ name: 'seeOffer', params: { id: purchase.id } }">
              <button class="seeAddBtn">Voir l'annonce</button>
            </RouterLink>
          </div>


        </div>

      </div>



    </div>
  </main>
</template>

<style scoped>
main {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  padding-top: 20px;
}

h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
}

.container > h1 {
  font-size: 22px;
}

/* partie profile */

.profile {
  border: 2px solid var(--med-grey);
  border-radius: 8px;
  display: flex;
  gap: 50px;
  padding: 10px;
  margin-bottom: 30px;
}

.profile img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  /* border: 1px solid orchid; */
}

.profile > div {
  /* border: 1px solid green; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;


}

.profile > div:first-child {
  position: relative;
}


.editAvatarIcon {
  color: var(--med-grey);
  border: 1px solid var(--med-grey);
  border-radius: 50%;
  font-size: 25px;
  padding: 5px;
  position: absolute;
  top: 0px;
  right: -10px;
  cursor: pointer;
}



input[type='file'] {
  display: none;
}


.profile p {
  font-size: 18px;

}

.profile span {
  font-weight: bold;
}

.username {
  /* border: 1px solid red; */
  display: flex;
  gap: 10px;
  align-items: center;
}

.editNameIcon {
  color: var(--med-grey);
  border: 1px solid var(--med-grey);
  border-radius: 50%;
  padding: 5px;
  font-size: 25px;
  cursor: pointer;
}



.changeUsername label {
  font-weight: bold;
  font-size: 18px;
}

.changeUsername input {
  border: none;
  border-bottom: 1px solid var(--med-grey)
}


/* Offers Bloc */
.offersBloc {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* partie onGoingOffers */

.offers {
  /* border: 1px solid red; */
  border: 2px solid var(--med-grey);
  border-radius: 8px;
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

}

.offers div {
  /* border: 1px solid blue; */
  display: flex;
  gap: 30px;
  align-items: center;
  margin-right: 20px;
}

.offers img {
  height: 60px;
  width: 60px;
  border-radius: 5px;
}

.offers p {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.offers span {
  color: var(--grey);
  font-size: 14px;
  margin-left: 15px;
}

.updateBtn {
  background-color: var(--orange);
  border: none;
  padding: 3px 10px 3px 10px;
  border-radius: 10px;
  color: white;
  /* font-weight: bold; */
}

.offers svg {
  font-size: 20px;
  color: var(--med-grey);
  cursor: pointer;
}





.seeAddBtn {
  background-color: transparent;
  border: none;
  color: var(--grey);
  cursor: pointer;

}

.pastOffers svg {
  font-size: 20px;
  color: var(--med-grey);
  cursor: pointer;
}

/* Pour le text ("Supprimer cette annonce") au survol de licone poubelle */
.tooltip {
  position: relative;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid var(--med-grey);
  color: inherit;
  font-size: inherit;
  padding: 3px 8px;
  border-radius: 4px;
  opacity: 0;
}

.tooltip:hover::after {
  opacity: 1;
  white-space: nowrap;
}



.noAdd {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

}

.noAdd p {
  font-size: 18px;
  margin-bottom: 30px;
}
</style>
