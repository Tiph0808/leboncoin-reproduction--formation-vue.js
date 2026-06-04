<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter()

const title = ref('')
const description = ref('')
const price = ref(null)
// je cree une ref pour les nouvelles photos selectionnees
const newPictures = ref([])
const isLoading = ref(false)

// Je crée une ref  pour les photos existantes
const existingPictures = ref([])

const errorMessage = ref('')

const GlobalStore = inject('GlobalStore')

// je recupere l'id de loffre envoyée en params grace aux props (au click sur le routerLink "modifier mon annonce" de profileView, jenvoie le params)
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
console.log(props.id)

// Au montage du composant je veux recuperer les infos de l'offre et pré remplir mes champs avec ( je pense a populate la clé picture sinon je naurai pas les photos dans ma reponse)
onMounted(async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/offers/${props.id}?populate[0]=picture`)
    console.log(data)
    title.value = data.data.attributes.title
    description.value = data.data.attributes.description
    price.value = data.data.attributes.price
    existingPictures.value = data.data.attributes.picture.data.map((picture) => (picture.attributes.url))

    console.log(existingPictures.value)
  } catch (error) {
    console.log('catch update : ', error.message)
  }
})



// Lorsque j'ai terminé mes modifs je clic sur mon bouton et je declenche la fonction qui va permettre d'update mon offre
const handleSubmit = async () => {

  // On verifie comme pour une creation d'offre que les champs obligatoires sont bien remplis
  // RMQ : les photos ne sont pas verifiées ici car elles sont gérées coté Strapi ( voir fichier src/api/offer/controllers/offer.js)
  if (title.value && description.value && price.value) {

    isLoading.value = true

    // je recupere l'id de l'owner pour l'envoyer dans mon stingifiedObj qui contiendra toutes les infos des champs (sauf les images)
    const owner = GlobalStore.userInfos.value.id

    // Je cree un formData qui va contenir les infos a envoyer
    const formData = new FormData()

    //  J'ajoute mes images une par une a ce formData
    for (const picture of newPictures.value) {
      formData.append('files.picture', picture)
    }

    // Un formdata ne peut transporter que les strings ou des fichiers, pas d'objet!
    // Donc, les infos a envoyer je les stocke dans un obj que je dois STRINGIFIER  pour qu'elles soient ajoutées forData
    const stringifiedObj = JSON.stringify({
      title: title.value,
      description: description.value,
      price: price.value,
      owner: owner
    })

    console.log('stringifiedObj :', stringifiedObj)
    console.log('owner :', owner)

    // J'ajoute mes infos
    formData.append('data', stringifiedObj)

    // Je fais ma requete pour UPDATE (put) mon offre en envoyant mon formData en 2eme arg (+ le bearer token en 3eme arg, car la route est reservee aux utilisateurs connectes)
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/offers/${props.id}`, formData, {
        headers: {
          Authorization: `Bearer ${GlobalStore.userInfos.value.token}`
        }
      })
      console.log('offre créée : ', data)
      isLoading.value = false
      // une fois la requete terminée je veux etre redirigée vers la page de l'offre, cette route recois en params l'id de l'offre (voir index.js) , cet id se trouve à la clé data.id de notre reponse (donc data.data.id)
      router.push({ name: 'offer', params: { id: data.data.id } })
    } catch (error) {
      console.log(error.message)
    }


  } else {
    errorMessage.value = 'Veuillez remplir tous les champs'
  }


}

// Pour afficher un preview des images avant de valider la requete , càd lorsqu'on selectionne le fichier
// Je crée une url pour chaque image (interpretable pour une balise img) a partir des infos grâce a la pp computed :
const imagesPreview = computed(() => {
  // je cree un tableau d'URLS grace a map qui parcourt mon tableau
  return newPictures.value.map((picture) => URL.createObjectURL(picture))
})
console.log(imagesPreview)


const selectPictures = (event) => {
  console.log(event.target.files)
  errorMessage.value = ''
  const numOfFiles = event.target.files.length
  //console.log(numOfFiles) // nombre de fichiers/d'éléments dans l'objet event.target.files ( objet que jai préféré transformer en tableau directement lorsque je l'attribue comme valeur a ma ref pictures, car je vais devoir boucler dessus et je prefere boucler sur un tableau que sur un objet :) )
  if (numOfFiles <= 10) { // consigne : 10 photos MAX
    newPictures.value = Array.from(event.target.files)
  } else {
    errorMessage.value = '10 photos maximum'
  }

}

</script>



<template>
  <main>
    <div class="container">

      <h1>Modifier mon annonce</h1>
      <form @submit.prevent="handleSubmit">
        <label for="title">Titre de l'annonce </label>
        <input type="text" name="title" id="title" v-model="title" @input="errorMessage = ''">
        <p>Vous n'avez pas besoin de mentionner « Achat » ou « Vente » ici.</p>

        <label for="description">Description de l'annonce</label>
        <textarea id="description" name="description" rows="10" cols="30" @input="errorMessage = ''"
          v-model="description"></textarea>
        <p>Nous vous rappelons que la vente de contrefaçons est interdite. Nous vous invitons à ajouter tout élément
          permettant de prouver l’authenticité de votre article: numéro de série, facture, certificat, inscription de la
          marque sur l’article, emballage etc. Indiquez dans le texte de l’annonce si vous proposez un droit de
          rétractation à l’acheteur. En l’absence de toute mention, l’acheteur n’en bénéficiera pas et ne pourra pas
          demander le remboursement ou l’échange du bien ou service proposé</p>

        <label for="price">Votre prix de vente</label>
        <div class="priceBloc">
          <input type="number" id="price" name="price" @input="errorMessage = ''" v-model="price">
          <p>€</p>
        </div>


        <div class="existingPictures">
          <img v-for="(url, index) in existingPictures" :key="index" :src=url alt="">
        </div>



        <label> Modifier mes photos </label>
        <label for="pictures" class="fileInput">
          <font-awesome-icon :icon="['fas', 'camera']" />
          <span>Selectionnez jusqu'à 10 photos</span>
        </label>
        <input type="file" id="pictures" name="pictures" multiple @input="selectPictures">

        <div v-if="newPictures" class="previews">
          <img v-for="(preview, index) in imagesPreview" :key="index" :src="preview">
        </div>



        <p v-if="isLoading">Enregistrement en cours...</p>
        <button v-else>Modifier mon annonce</button>

        <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>


      </form>
    </div>
  </main>
</template>




<style scoped>
main {
  background-color: var(--light-grey);
  padding: 40px 0;
}

.container {
  background-color: white;
  padding: 20px;
  border-radius: 20px;
}

h1 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 40px;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

label {
  margin: 30px 0px 10px 0px;
}

p {
  color: var(--grey);
  font-size: 12px;
  margin-top: 5px;
  width: 770px;
}

input,
textarea {
  border: 1px solid var(--grey);
  border-radius: 10px;
  width: 770px;
}

/* Je cible uniquement mon input de type text */
input[type='text'] {
  height: 45px;
  border-radius: 10px;
}

.priceBloc {
  display: flex;
  align-items: center;
  height: 45px;
}

.priceBloc input {
  width: 190px;
  height: 100%;
  border-radius: 10px 0 0 10px;
}

.priceBloc p {
  /* j'annule d'abord le style qui s'applique a tous les autres p */
  font-size: 16px;
  margin-top: 0px;
  width: 45px;
  border: 1px solid var(--grey);
  height: 100%;
  border-left: none;
  border-radius: 0px 10px 10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pour faire disparaitre les fleches presentes par défaut dans l'input de type number (trouvé sur internet) */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* photos pré-existantes */
.existingPictures {
  display: flex;
}



/* Pour l'ajout de photos : Pour obtenir le resultat demandé, je dois faire disparaitre moon input et styliser son label (comme le label est relié a son input grâce à son id, quand je clique sur le label, c'est comme si je cliquais sur  mon input*/
input[type='file'] {
  display: none;
}

/* je stylise le label */
.fileInput {

  margin-top: 0;
  border: 1px solid var(--grey);
  height: 150px;
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
}

.fileInput svg {
  font-size: 28px;
  color: var(--blue-navy);
}

.fileInput span {
  text-align: center;
  color: var(--blue-navy);
}

button {
  background-color: var(--orange);
  border: none;
  padding: 5px 10px 5px 10px;
  border-radius: 10px;
  color: white;
  align-self: flex-end;
  margin-top: 40px;
}

.previews {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

img {
  width: calc((100% - 40px) / 5);
  /*Je veux des carrés, je peux utiliser la pp aspect ratio  et lui donner la valeur : 1/1 */
  aspect-ratio: 1/1;
  border-radius: 5px;
  object-fit: cover;
}

.errorMessage {
  font-size: 16px;
  color: var(--orange);
}
</style>
