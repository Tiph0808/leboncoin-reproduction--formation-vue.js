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

const inputType = ref('password')


const handlePassword = () => {
  if (inputType.value === 'password') {
    inputType.value = 'text'
  } else {
    inputType.value = 'password'
  }
}


</script>

<template>
  <main>
    <div class="container">
      <form @submit.prevent="handleSubmit">
        <div>
          <h1>Bonjour !</h1>
          <h2>Connectez-vous pour decouvrir toutes nos fonctionnalités</h2>
        </div>
        <label for="email"><span>Email <sup>*</sup></span><input type="text" v-model="email" id="email"
            @input="errorMessage = ''">
        </label>
        <label for="password"><span>Mot de passe <sup>*</sup></span>
          <div>
            <input :type="inputType" v-model="password" id="password" @input="errorMessage = ''">
            <font-awesome-icon :icon="['far', 'eye-slash']" v-if="inputType === 'password'" @click="handlePassword" />
            <font-awesome-icon :icon="['far', 'eye']" v-if="inputType === 'text'" @click="handlePassword" />

          </div>
        </label>


        <p v-if="isSubmitting">Connexion en cours...</p>
        <button v-else>Se connecter <font-awesome-icon :icon="['fas', 'arrow-right']" /> </button>

        <p v-if="errorMessage">{{ errorMessage }}</p>

        <p>Envie de nous rejoindre ? <RouterLink :to="{ name: 'signup' }">Créer un compte</RouterLink>
        </p>
      </form>


    </div>
  </main>
</template>

<style scoped>
main {
  height: calc(100vh - var(--header-height) - var(--footer-height));
}

.container {
  background-image: url("../assets/leboncoin1-assets/illustration.png");
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

/* h2 {
  margin-bottom: 20px;
} */

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
