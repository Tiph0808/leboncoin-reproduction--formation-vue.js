<script setup>
import { onMounted, onBeforeMount, ref, computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

// je recois l'id en params en props, donc je defini mes props en premier
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
console.log('id:', props.id)

// Je recupere mon token de connexion de mon globalStore ar poir acheter il faut etre authentifié
const GlobalStore = inject('GlobalStore')

// pour utiliser vue Router
const router = useRouter()

// je crée une ref pour les infos de l'offre
const offerInfos = ref(null)
// Je cree une ref pour la photo
const picture = ref([])

// Je cree mes ref pourles champs de mon formulaire
const firstname = ref('')
const lastname = ref('')

// Je crée ma ref pour afficher un message d'erreur si tous les champs ne sont pas remplis
const errorMessage = ref('')

// Je crée une ref pour la livraison ( d'apres le modele , par defaut je coche sans livraison)
const sort = ref('pick-up')

// REFS POUR PAIEMENT STRIPE
// Je cree ma ref qui stockera l'element 'Card'
const cardElement = ref(null)
// je crée ma ref pour l'affichage conditionnel
const confirmedPayment = ref(false)



// PAIEMENT AVEC STRIPE

// Je lance la creation de mon instance stripe :
const stripePromise = loadStripe('pk_test_51TKbLGHHvJ79sOwaBskX192gbiHvUhngydcxviOhrpWm93fnI7Nl5JUGfdO5a1kgyzmsPfJumDXkjiAQxN8wunHx00oSD8AFjK')

onBeforeMount(async () => { // Hook qui se declenche avant le montage du composant
  // je recupere mon instance stripe
  const stripe = await stripePromise
  // Je crée mon gestionnaire d'élémént Stripe
  const elements = stripe.elements() // ceci retourne un objet qui sait créer et gérer des champs de formulaire sécurisés
  // Grace a ce gestionnaire je peux creer un element 'Card' qui sera stocké dans la ref cardElement
  cardElement.value = elements.create('card', {}) // en deuxieme arg, entre les crochets on peut appliquer du style (voir cours p.14)
  // Je monte mon element a l'int de ma div ayant pour id card-element (id -> #)
  cardElement.value.mount('#card-element')

})

// Au montage du composant je recupere les infos de mon offre
onMounted(async () => {
  try {
    const { data } = await axios.get(`http://localhost:1337/api/offers/${props.id}?populate[0]=picture`)
    // pour les infos
    console.log('offerInfos', data.data)
    // pour avoir l'url
    console.log(data.data.attributes.picture.data[0].attributes.url)
    // pour avoir le prix
    console.log(data.data.attributes.price)

    offerInfos.value = data.data
    picture.value = data.data.attributes.picture.data[0].attributes.url
  } catch (error) {
    console.log("catch offerInfos :", error.message)
  }
})

// j'uitlise ocmputed pour mettre mon prix au bon format
const price = computed(() => {
  const newPrice = new Intl.NumberFormat('fr-FR').format(offerInfos.value.attributes.price)
  return newPrice
})
// REMARQUE IMPORTANTE tant que le composant n'est pas chargé price sera null donc inutilisable dans le template ---> la condition v-if offerInfos dans le template permet d'afficher price sans que ca plante.
// Mais attention si il n'y a pas de v-if dans mon template , il faut securiser mon computed avec un optionnal chaining:
// const price = computed(() => {
//   const newPrice = new Intl.NumberFormat('fr-FR').format(offerInfos.value?.attributes?.price)
//   return newPrice
// })


// je cree un price total grace a computed, en fonction de ma selection de livraison dans le form de type radio
const totalPrice = computed(() => {
  let protectionFee = 0.99
  let deliveryFee = 15.60
  let total = protectionFee + offerInfos.value.attributes.price
  if (sort.value === "delivery") {
    total = total + deliveryFee
  }
  return parseFloat(total.toFixed(2))
})
// REMARQUE IMPORTANTE:
// Les ordis stockent les nombres decimaux en binaire. Certains nombres ne peuvent pas etre representés en binaire (tout comme 1/3=0.33333333 a l'infini, en binaire 0.99 ou 12.99 ne peuvent pas etre représentés par exemple. VOIR CLAUDE:"Precision des flottants en JS" ).
// Les DECIMAUX etant donc imprecis en binaire, par soucis de justesse, on utilise toFixed(2) qui arrondit à 2 decimales et renvoi un string, AVEC parseFloat pour reconvertir en nombre



// Au clic sur Payer je declenche ma fonction handlePayment grace a laquelle jenvoie les infos de la transaction au back end via une requete
const handlePayment = async () => {
  // pour que l'utilisateur remplisse les champs necessaires
  if (firstname.value && lastname.value) {
    try {
      // j'utilise (de nouveau) mon instance stripe :
      const stripe = await stripePromise
      // je demande a stripe de checker les infos entrées dans le champ de la carte et de me renvoyer un token si cest ok :

      const { token } = await stripe.createToken(cardElement.value)
      console.log(token) // cette methode me renverra un objet qui contient mon token la clé token(ici destructurée) (et qui elle meme a une clé id)
      // je stocke mon token pour l'envoyer dans ma requete
      const stripeToken = token.id
      // Je fais ma requete en envoyant les infos de la transaction (ici 3 infos : le title de l'offre, son prix (amount) et le token )
      const response = await axios.post('http://localhost:1337/api/offers/buy', {
        token: stripeToken,
        amount: totalPrice.value, // RMQ : le prix tota doit tenir compte du choix de livraison! on prend donc le totalPrice calculé plus haut. Attention! : il faut mettre .value aussi pour un computed
        title: offerInfos.value.attributes.title
      }, { headers: { Authorization: `Bearer ${GlobalStore.userInfos.value.token}` } }) // MA route est reservée aux utilisateurs authentifiés dans strapi je dois donc rajouter un header avec le token stocke a la connexion de l'utilisateur
      console.log(response)

      // si la transaction est validee j'affiche un message de confirmation et je redirige vers la page d'acceuil :)
      if (response.data.status === "succeeded") {
        confirmedPayment.value = true,
          alert(`paiement de ${totalPrice.value} validé pour l'achat du produit ${offerInfos.value.attributes.title}`,
            router.push({ name: 'home' })
          )
      }

    } catch (error) {
      console.log('error :', error.message)
    }
  } else {
    errorMessage.value = "Veuillez remplir nom et prenom"
  }
}
</script>

<template>
  <main>
    <h1>payment page</h1>
    <div>
      <form @submit.prevent="handlePayment">
        <label for="firstname">Prénom</label><input type="text" id="firstname" name="firstname" v-model="firstname"
          @input="errorMessage = ''">
        <label for="lastname">Nom</label><input type="text" id="lastname" name="lastname" v-model="lastname"
          @input="errorMessage = ''">
        <label for="tel">Téléphone</label><input type="tel" id="tel">

        <div id="card-element"></div>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <button>Payer</button>

      </form>

    </div>

    <p v-if="offerInfos === null">Loading</p>
    <div v-else class="transactionInfos">
      <img :src=picture alt="">
      <p>{{ price }} €</p>

      <form>
        <label> Remise en mains propres<input type="radio" value="pick-up" id="pick-up" name="delivery-options"
            v-model="sort"></label>
        <label>Colissimo<input type="radio" value="delivery" id="delivery" name="delivery-options"
            v-model="sort"></label>


      </form>
      <p>{{ totalPrice }} €</p>

    </div>




  </main>
</template>
<style scoped></style>
