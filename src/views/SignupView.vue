<script setup>
import { ref, inject } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('')
const email = ref('')
const password = ref('')

// je cree mes ref pour l'affichage conditionnel
const errorMessage = ref('')
const isSubmitting = ref(false)

// jinjecte mon provider et ces infos
const GlobalStore = inject('GlobalStore')
console.log('GlobalStore >>>', GlobalStore)

// je declenche la methode userRouter et stocke ce qu'elle renvoie dans la variable router
const router = useRouter()


// je fais ma requete a la soumission du formulaire :
const handleSubmit = async () => {
  //Je verifie que les infos entrées dans les input sont bien transmises
  console.log('Submit', {
    username: username.value,
    email: email.value,
    password: password.value
  })

  isSubmitting.value = true
  //Je verifie que tous les champs sont remplis avant d'envoyer ma requete:
  if (username.value && email.value && password.value) {
    try {
      // je fais ma reqeute en interrogeant l'url indiquée et en envoyant mes infos en 2eme argument sous forme d'objet avec les clés necessaires pour créer mon utilisateur
      const { data } = await axios.post('https://site--strapileboncoin--2m8zk47gvydr.code.run/api/auth/local/register', {
        username: username.value,
        email: email.value,
        password: password.value
      })
      console.log('response >>>', data)
      GlobalStore.changeToken(data.jwt) // Pour verifier que le global store a bien été modifié --> Vue devtools : je regarde ce qu'il y a dans mon global store : je dois voir que la valeur de userToken est maintenant egale au jwt reçu
      GlobalStore.changeName(data.user.username)
      // une fois connecté on veut naviguer vers la page d'acceuil grace a la methode push appliqué a router ( je dois importer useRouter avant)
      router.push({ name: 'home' })
    } catch (error) {
      console.log('catch >>>', error)
      errorMessage.value = "Un problème est survenu, veuillez essayer à nouveau"
    }
    isSubmitting.value = false
  } else {
    errorMessage.value = "Veuillez remplir tous les champs"
  }

}



</script>
<template>
  <main>
    <div class="container">


      <form @submit.prevent="handleSubmit">

        <h1>Bonjour !</h1>
        <h2>Inscrivez-vous pour découvrir toutes nos fonctionnalités</h2>

        <label for="username">Nom <sup>*</sup></label><input type="text" v-model="username" id="username">
        <!-- la balise sup sert a afficher l'étoile en tant qu'exposant -->
        <label for="email">Email <sup>*</sup></label><input type="email" v-model="email" id="email">
        <label for="password">Password <sup>*</sup></label><input type="password" v-model="password" id="password">

        <p v-if="isSubmitting">Inscription en cours...</p>
        <button v-else>S'inscrire</button>

        <p v-if="errorMessage">{{ errorMessage }}</p>

        <p>
          Vous avez déja un compte ?
          <RouterLink :to="{ name: 'login' }">Connectez-vous</RouterLink>
        </p>

      </form>


    </div>
  </main>
</template>


<style scoped></style>
