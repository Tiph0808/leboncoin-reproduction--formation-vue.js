<script setup>
import { RouterLink } from 'vue-router';
import { ref, inject } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // jimporte use router pour pouvoir envoyer mon utilisateur vers la page home si la requete a reussi

const email = ref('joel@aol.com')
const password = ref('password')

// je declenche la methode userRouter et stocke ce qu'elle renvoie dans la variable router
const router = useRouter()

// je cree mes ref pour l'affichage conditionnel:
const errorMessage = ref('')
const isSubmitting = ref(false)

// jinjecte mon provider
const GlobalStore = inject('GlobalStore')





const handleSubmit = async () => {
  //Je rverifie que les infos du form sont transmises
  console.log({
    identifier: email.value,
    password: password.value
  })
  isSubmitting.value = true
  if (email.value && password.value) {
    try {
      const { data } = await axios.post('https://site--strapileboncoin--2m8zk47gvydr.code.run/api/auth/local', {
        identifier: email.value,
        password: password.value
      })
      console.log(data)
      // pour stocker mes infos dans le globalStore j'appelle les differentes fonctions crées dans mon provider :
      GlobalStore.changeToken(data.jwt)
      GlobalStore.changeName(data.user.username) // meme si on s'identifie avec l'eamil, on recoit le username crée lors de l'inscription dans la reponse, il se trouve a la clé data.user.username
      // si ma requete est successful je renvoie mon utilisateur vers la page d'acceuil :
      router.push({ name: 'home' })
    } catch (error) {
      console.log('catch >>>', error)
    }
    isSubmitting.value = false
  } else {
    errorMessage.value = 'Veuillez remplir tous les champs'
    isSubmitting.value = false // sinon le bouton ne reapparaitra pas!


  }
}
</script>

<template>
  <main>
    <div class="container">

      <form @submit.prevent="handleSubmit">
        <label for="email">Email <sup>*</sup></label><input type="text" v-model="email" id="email"
          @input="errorMessage = ''">
        <label for="password">Mot de passe <sup>*</sup></label><input type="password" v-model="password" id="password"
          @input="errorMessage = ''">

        <p v-if="isSubmitting">Connexion en cours...</p>
        <button v-else>Se connecter</button>

        <p v-if="errorMessage">{{ errorMessage }}</p>
      </form>



      <p>Envie de nous rejoindre ? <RouterLink :to="{ name: 'signup' }">Créer un compte</RouterLink>
      </p>
    </div>
  </main>
</template>

<style scoped>
main {
  height: calc(100vh - var(--header-height) - var(--footer-height));
}
</style>
