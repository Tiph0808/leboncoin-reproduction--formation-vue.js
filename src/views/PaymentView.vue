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
// Je cree une ref pour l'affichage conditionnel de ma partie infos
const isLoading = ref(true)

// Je cree mes ref pourles champs de mon formulaire
const firstname = ref('')
const lastname = ref('')
const phone = ref('')

// Je crée ma ref pour afficher un message d'erreur si tous les champs ne sont pas remplis
const errorMessage = ref('')

// Je crée une ref pour la livraison ( d'apres le modele , par defaut je coche sans livraison)
const option = ref('pick-up')

// REFS POUR PAIEMENT STRIPE
// Je cree ma ref qui stockera l'element 'Card'
const cardElement = ref(null)
// je crée ma ref pour l'affichage conditionnel de mon bouton
const isProcessing = ref(false)


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
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/offers/${props.id}?populate[0]=picture`)
    // pour les infos
    console.log('offerInfos', data.data)
    // pour avoir l'url (uniquement de la premiere image car ic on ne veut afficher que celle ci, pas de carroussel!)
    console.log(data.data.attributes.picture.data?.[0]?.attributes.url) // je protege du plantage avec l'otionnal chaining au cas ou il n'y ait pas d'image dans l'annonce
    // pour avoir le prix
    console.log(data.data.attributes.price)

    offerInfos.value = data.data
    picture.value = data.data.attributes.picture.data[0].attributes.url
  } catch (error) {
    console.log("catch offerInfos :", error.message)
  }
  isLoading.value = false
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
  let total = protectionFee + offerInfos.value.attributes.price
  let deliveryFee = 15.60
  if (option.value === "delivery") {
    total = total + deliveryFee
  }
  return parseFloat(total.toFixed(2))
})
// REMARQUE IMPORTANTE:
// Les ordis stockent les nombres decimaux en binaire. Certains nombres ne peuvent pas etre representés en binaire (tout comme 1/3=0.33333333 a l'infini, en binaire 0.99 ou 12.99 ne peuvent pas etre représentés par exemple. VOIR CLAUDE:"Precision des flottants en JS" ).
// Les DECIMAUX etant donc imprecis en binaire, par soucis de justesse, on utilise toFixed(2) qui arrondit à 2 decimales et renvoi un string, AVEC parseFloat pour reconvertir en nombre

// Dans la correction elle fait differemment :
// const total= computed(()=>{
//   let optionPrice=0 // on crée une variable pour le prix des options
//   if(option.value==='delivery'){
//     optionPrice = 15.6
//   }
// return 0.99 + optionPrice + offerInfos.value.attributes.price
// })




// Au clic sur Payer je declenche ma fonction handlePayment grace a laquelle jenvoie les infos de la transaction au back end via une requete


const handlePayment = async () => {

  // correction: elle gere l'obligation de remplir les champs de cette facon :
  // si les champs ne sont pas remplis elle return error message ce qui stopera la fonction
  // if(!firstname.value || lastname.value !) {
  // return errorMessage.value='prénom et nom obligatoires'
  //}

  // My way : pour que l'utilisateur remplisse les champs necessaires if else, et non if return
  if (firstname.value && lastname.value) {
    isProcessing.value = true
    try {

      // j'utilise (de nouveau) mon instance stripe :
      const stripe = await stripePromise
      // je demande a stripe de checker les infos entrées dans le champ de la carte et de me renvoyer un token si cest ok :

      const { token } = await stripe.createToken(cardElement.value)
      console.log(token) // cette methode me renverra un objet qui contient mon token la clé token(ici destructurée) (et qui elle meme a une clé id)
      // je stocke mon token pour l'envoyer dans ma requete
      const stripeToken = token.id
      // Je fais ma requete en envoyant les infos de la transaction (ici 3 infos : le title de l'offre, son prix (amount) et le token )
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/offers/buy`, {
        token: stripeToken,
        amount: totalPrice.value, // RMQ : le prix tota doit tenir compte du choix de livraison! on prend donc le totalPrice calculé plus haut. Attention! : il faut mettre .value aussi pour un computed
        title: offerInfos.value.attributes.title,
        // Je rajoute comme infos l'id de l'offre pour pouvoir la supprimer apres paiment coté back
        id: props.id

      }, { headers: { Authorization: `Bearer ${GlobalStore.userInfos.value.token}` } }) // MA route est reservée aux utilisateurs authentifiés dans strapi je dois donc rajouter un header avec le token stocke a la connexion de l'utilisateur
      console.log('data-payment : ', response)

      // si la transaction est validee j'affiche un message de confirmation et je redirige vers la page d'acceuil :)
      if (response.data.status === "succeeded") {

        alert(`paiement de ${totalPrice.value} validé pour l'achat du produit ${offerInfos.value.attributes.title} par ${firstname.value} ${lastname.value}`,


          // Je veux que l'article acheté soit supprimé de ma liste d'offres :
          // Pour cela j'utilise l'id ((l'id de mon offre nous est envoyée en props dans ce composant)) de mon offre et je fais une requete au backend :
          // console.log(props.id)
          // await axios.delete(`${import.meta.env.VITE_API_URL}/api/offers/${props.id}`, { headers: { Authorization: `Bearer ${GlobalStore.userInfos.value.token}` } }),
          // ATTENTION : ceci ne marche pas car nous avons précedemment crée une policy is-authorized dans le projet strapi, qui consiste a verifier le la personne qui fait une requete est bien le proprietaire de l'offre. Cette policy est appliquee aux routes update, delete et create ( d'apres le fichier src>api>offer>routes>offer.js ). Cette policy sur la route delete empeche de supprimer une annonce si on en est pas le proprietaire. Ce qui sera TOUJOURS le cas dans le cas d'un achat!! LOGIQUE! donc on laisse cette policy telle qu'elle est et on va donc gerer la suppression de l'annonce juste apres la validation de l'achat coté backend :) ---> comment? en etendant le comportement du controller de la route buy (fichier src>ap>offer>>controller>offer.js)



          router.push({ name: 'home' })
          //router.replace({name:'home'}) // elle utilise la methode replace au lieu de push qui permet au moment de la naviguation de faire un remplacement dans l'historique ( au lieu de payment, la derniere page visitée, on aura la page de l'offre, l'avant derniere).
          // avec replace, lapage qu'on quitte n'est plus accessible en cliquant sur le bouton retour dans le navigateur
          // Je ne comprends pas pourquoi elle fait ca, car meme si on ne retombe pas sur la page paiement on retombe sur l'annonce du produit qu on est sensé avoir deja acheter !!! ça n'a aucun sens, je prefere laisser comme ca et modifier mon back end plus tard pour qu'il supprime automatiquement un produit qui a été acheté )
        )
      }

    } catch (error) {
      console.log('error :', error.message)
    }
    isProcessing.value = false
  } else {
    errorMessage.value = "nom et prénom obligatoires"
  }
}
</script>

<template>
  <main>
    <div class="container">
      <h1>Finalisez votre paiement</h1>

      <div>
        <div class="clientInfos">

          <form @submit.prevent="handlePayment">

            <div>
              <h2>Informations personnelles</h2>
              <p>Une piece d'identité vous sera demandée pour récupérer votre colis</p>
              <label for="firstname">Prénom</label>
              <input type="text" id="firstname" name="firstname" placeholder="Prénom" v-model="firstname"
                @input="errorMessage = ''">
              <label for="lastname">Nom</label>
              <input type="text" id="lastname" name="lastname" placeholder="Nom" v-model="lastname"
                @input="errorMessage = ''">
              <label for="tel">Téléphone</label>
              <input type="tel" id="tel" placeholder="Téléphone" v-model="phone">

            </div>

            <p>Vous ne serez débité que lorsque le vendeur aura confirmé la disponibilité de la commande.</p>

            <div>
              <h2>Coordonnées bancaires</h2>
              <div id="card-element"></div>

              <div class="btnPart">
                <button :disabled="isProcessing">Payer</button>
                <!-- mon bouton se grise si la requete de paiement est en cours -->
                <p v-if="errorMessage">{{ errorMessage }}</p>
              </div>

              <p>Paiement sécurisé Votre banque peut vous demander d’autoriser le paiement pour compléter votre achat.
              </p>
              <p>Vous êtes sur un serveur de paiement sécurisé par les normes ssl (https) et pcidss de nos partenaires
                bancaires. Vos données sont encryptées pour plus de sécurité.</p>
            </div>

          </form>
        </div>


        <p v-if="isLoading">Chargement en cours...</p>
        <div v-else class="transactionInfos">

          <div>
            <div class="articleInfos">
              <img :src=picture alt="">
              <h3>{{ offerInfos.attributes.title }}</h3>
            </div>
            <p class="price">{{ price }} €</p>
          </div>

          <div class="optionPart">
            <h3>Mode de remise</h3>

            <div>
              <input type="radio" name="delivery-options" id="pick-up" value="pick-up" v-model="option">
              <label for="pick-up">
                <div>
                  <p>Remise en main propre</p>
                  <p>Payez en ligne et récupérez votre achat en main</p>
                  <p>propre lors de votre rendez-vous avec le vendeur</p>
                </div>
              </label>
            </div>

            <div>
              <input type="radio" value="delivery" id="delivery" name="delivery-options" v-model="option">
              <label for="delivery">
                <div>
                  <p>Colissimo</p>
                  <p>à votre domicile sous 2-3 jours</p>
                </div>
              </label>
              <p class="price">15,60 €</p>
            </div>


            <div>
              <h3>Protection leboncoin</h3>
              <p class="price">0.99 €</p>
            </div>

            <p><font-awesome-icon :icon="['fas', 'check']" /><span>Votre argent est sécuisé et versé au bon
                moment</span></p>
            <p><font-awesome-icon :icon="['fas', 'check']" /><span>Notre service client dedié vous accompagne</span>
            </p>

          </div>

          <div>
            <h2>Total</h2>
            <p class="price">{{ totalPrice }} €</p>
          </div>



        </div>
      </div>



    </div>
  </main>
</template>


<style scoped>
main {
  padding: 40px 0px;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
}

h1 {
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 24px;
}

h2 {
  font-size: 18px;
  font-weight: bold;
}

/* pour cibler les balises p qui sont JUSTE APRES h2 ( il n'y a qu un h2 ;) ) */
h2 + p {
  font-size: 12px;
  line-height: 20px;
  margin-bottom: 15px;
}

h3 {
  font-weight: bold;
  margin-bottom: 10px;
}

.container > div {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  /* Pour réduire la deuxieme colonne à la hauteur de son contenu */
}

/* ----Left part----- */

.clientInfos {
  /* border: 1px solid green; */
  flex: 1;
  /* on a donné une largeur a la partie droite, on demande a la partie gauche de prendre toute la pplace restante */
}



.clientInfos > form > div {
  box-shadow: 0 0 7px var(--med-grey);
  border-radius: 8px;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
}

.clientInfos p {
  font-size: 12px;
}

.clientInfos > form > p {
  margin: 20px 0;
}

.clientInfos label {
  margin-bottom: 10px;
}

.clientInfos input {
  border: 1px solid var(--med-grey);
  border-radius: 5px;
  height: 45px;
  margin-bottom: 15px;
  padding-left: 10px;
}

#card-element {
  margin: 20px 0;
  border: 1px solid var(--med-grey);
  border-radius: 5px;
  min-height: 45px;
  padding: 15px;
}


.btnPart {
  /* border: 1px solid pink; */
  display: flex;
  gap: 30px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btnPart p {
  color: orange;
  font-size: 16px;
}

/* Mes div enfant direct sont en display flex, donc je peux appliquer un align-self a un de leur enfant */
.clientInfos button {
  align-self: flex-start;
  background-color: var(--orange);
  color: white;
  padding: 7px 10px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
}

/* Je stylise aussi le " grisement" de mon button */
.clientInfos button:disabled {
  opacity: 0.5;
  cursor: auto;
}



/* -----Right----- part */

.transactionInfos {
  /* border: 1px solid red; */
  width: 355px;
  box-shadow: 0 0 7px var(--med-grey);
  border-radius: 15px;
}

.articleInfos {
  /* border: 1px solid blue; */
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: bold;
}

.articleInfos img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}

.transactionInfos > div:not(:nth-child(2)) {
  /* border: 1px solid blue; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin: 20px 0;
}

.optionPart {
  border-top: 1px solid var(--med-grey);
  border-bottom: 1px solid var(--med-grey);
  padding: 15px;
}

.optionPart > div {
  /* border: 1px red solid; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}


/* Je cible toutes les balises p de mes labels sauf les premieres */
.optionPart label > div > p:not(:first-child) {
  font-size: 12px;
  color: var(--med-grey);
  line-height: 20px;
}


.optionPart > p {
  display: flex;
  margin-bottom: 8px;

}

.price {
  font-weight: bold;
  color: var(--brown);
  font-size: 16px;
  /* je dois ecraser le style de h2+p */
  margin-bottom: 0;
  /* je dois ecraser le style de h2+p */
}

svg {
  color: green;
  margin-right: 15px;
}
</style>


<!-- Probleme : Pour le style, J'ai suivi ce qu'elle faisait. GROSSE ERREUR....
  sur les derniers blocs elle a été trop vite  :  sur le model il y a beaucoup moins d'espace que ca entre les boutons radio et le texte. J'ai essayer de reflechir a comment faire pour reduire cet espace, mais avec la structure qu'elle a fait  je ne trouve pas la solution. et le style est trop avancé pour tout changer
il y a aussi un décalage entre protection leboncoin et le prix de 0.99, ils ne sont pas sur la meme ligne.
 Conclusion : mieux vaut faire son style soi meme -->
