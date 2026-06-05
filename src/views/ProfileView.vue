<script setup>
import { onMounted, ref, inject } from 'vue';
import axios from 'axios';
import BtnPublishOffer from '@/components/BtnPublishOffer.vue';


const GlobalStore = inject('GlobalStore')

const profileInfos = ref(null)

const offers = ref([])

// Je cree une ref pour le changement de photo
const newAvatar = ref(null)


onMounted(async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${GlobalStore.userInfos.value.id}?populate[0]=offers&populate[1]=avatar&populate[2]=offers.picture`, {
      headers: {
        Authorization: `Bearer ${GlobalStore.userInfos.value.token}`
      }
    })
    console.log('reponse :', data)
    profileInfos.value = data
    offers.value = data.offers


  } catch (error) {
    console.log('catch ProfileView : ', error.message)
  }
})

// Pour afficher la date de publication correctement jai besoin d'une fonction
const formatedDate = (date) => {
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
              <font-awesome-icon :icon="['fas', 'pen']" class="editIcon" />
            </label>
            <input type="file" id="newPicture" name="newPicture" @change="changeAvatar">

          </div>

          <div>
            <div>
              <p><span>Nom : </span> {{ profileInfos?.username }}</p>
            </div>
            <div>
              <p><span>E-mail : </span>{{ profileInfos?.email }}</p>
            </div>

          </div>

        </div>
      </div>
      <div v-if="offers.length > 0">
        <h1>Mes annonces</h1>
        <div v-for="offer in offers" :key="offer.id" class="offers">
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
      <div v-else class="noAdd">
        <p>Aucune annonce enregistrée</p>
        <BtnPublishOffer />
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

.editIcon {
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



/* partie offers */

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
  /* border: 1px solid var(--med-grey); */
  /* color: black; */
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
