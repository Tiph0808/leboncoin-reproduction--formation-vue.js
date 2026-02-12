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
    isSubmitting.value = false
  }

}



</script>

<template>
  <main>
    <div class="container">
      <form @submit.prevent="handleSubmit">
        <div>
          <h1>Bonjour !</h1>
          <h2>Inscrivez-vous pour découvrir toutes nos fonctionnalités</h2>
        </div>

        <label for="username"><span>Nom <sup>*</sup></span><input type="text" v-model="username" id="username"
            @input="errorMessage = ''"></label>
        <!-- la balise sup sert a afficher l'étoile en tant qu'exposant -->
        <label for="email"><span>Email <sup>*</sup></span><input type="email" v-model="email" id="email"
            @input="errorMessage = ''"></label>
        <label for="password"><span>Password <sup>*</sup></span><input type="password" v-model="password" id="password"
            @input="errorMessage = ''"></label>

        <p v-if="isSubmitting">Inscription en cours...</p>
        <button v-else>S'inscrire <font-awesome-icon :icon="['fas', 'arrow-right']" /></button>

        <p v-if="errorMessage">{{ errorMessage }}</p>

        <p>
          Vous avez déja un compte ?
          <RouterLink :to="{ name: 'login' }">Connectez-vous</RouterLink>
        </p>

      </form>
    </div>
  </main>
</template>


<style scoped>
main {
  height: calc(100vh - var(--header-height) - var(--footer-height))
}

.container {
  background-image: url('../assets/leboncoin1-assets/illustration.png');
  background-size: contain;
  background-position: bottom;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;

}

form {
  /* border: 1px solid blue; */
  background-color: #fff;
  width: 480px;
  height: 490px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 0 7px var(--grey);
  border-radius: 15px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}


label {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  height: 45px;
  border-radius: 10px;
  padding-left: 10px;
}

input:focus {
  outline: none;
}

button {
  background-color: var(--orange);
  color: #fff;
  font-weight: bold;
  height: 45px;
  font-size: 13px;
  border: none;
  border-radius: 10px
}

svg {
  margin-left: 10px;
}

p:last-child {
  text-align: center;
}

a {
  font-weight: bold;
  text-decoration: underline;

}
</style>
