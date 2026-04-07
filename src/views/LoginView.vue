<script setup>
import { RouterLink } from 'vue-router';
import { ref, inject } from 'vue';
import axios from 'axios';
// import VueCookies from 'vue-cookies'
import { useRouter } from 'vue-router'; // jimporte use router pour pouvoir envoyer mon utilisateur vers la page home si la requete a reussi
import { useRoute } from 'vue-router'// j'importe useRoute pour acceder aux queries de cette route dont j'ai besoin pour ma redirection après ma requete
// je declenche la methode userRouter et stocke ce qu'elle renvoie dans la variable router
const router = useRouter()
// je declenche la methode userRoute et stocke ce qu'elle renvoie dans la variable route
const route = useRoute()
// jinjecte mon provider
const GlobalStore = inject('GlobalStore')


// VALEURS REACTIVES

const email = ref('claude@mail.com')
const password = ref('password')

// je cree mes ref pour l'affichage conditionnel:
const errorMessage = ref('')
const isSubmitting = ref(false)

// BONUS (correction) : je cree ma ref pour le password a afficher ou pas
const displayPassword = ref(false)

// je lance ma requete a la soumission du form
const handleSubmit = async () => {
  //Je rverifie que les infos du form sont transmises
  console.log({
    identifier: email.value,
    password: password.value
  })
  isSubmitting.value = true
  if (email.value && password.value) {
    try {
      const { data } = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: email.value,
        password: password.value
      })
      console.log(data)
      // pour stocker mes infos dans le globalStore j'appelle la  fonction crée dans mon provider :
      GlobalStore.changeUserInfos({
        username: data.user.username,
        token: data.jwt,
        id: data.user.id
      })  // meme si on s'identifie avec l'eamil, on recoit le username crée lors de l'inscription dans la reponse, il se trouve a la clé data.user.username

      // Pour rendre la connexion persistante : Je crée mon cookie avec ces infos
      // VueCookies.set('userInfos', {
      //   username: data.user.username,
      //   token: data.jwt
      // })
      // Finalement je l'ai cré dans main.js  des que je reçcois les infos apres connexion ou inscription
      // (ça me permet de n'écrire le code pour le crée que dans un seul fichier(main.js) au lieu de 2(loginView et signUpView) --> OPTIMISATION :) )


      // si ma requete est successful je renvoie mon utilisateur vers la page qu'il voulait initialement Si la query redirect a été ajoutée a cette route dans index.js ou vers la page d'acceuil :
      router.push({ name: route.query.redirect || 'home' })
      // sinon j'affiche un message d'erreur
    } catch (error) {
      console.log('catch >>>', error)
      errorMessage.value = 'Un problème est survenu, veuillez réessayer plus tard'
    }
    isSubmitting.value = false
  } else {
    errorMessage.value = 'Veuillez remplir tous les champs'
    isSubmitting.value = false // sinon le bouton ne reapparaitra pas!
  }
}


// BONUS (Myway)

// j'ajoute une valeur reactive : le type de mon password
// const inputType = ref('password')

// si c'est un password, au clic je le change en text, sinon je le laiise en password
// const handlePassword = () => {
//   if (inputType.value === 'password') {
//     inputType.value = 'text'
//   } else {
//     inputType.value = 'password'
//   }
// }







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
          <div class="inputPassword">
            <!-- <Bonus password (my way):>
            <input :type="inputType" v-model="password" id="password" @input="errorMessage = ''">
            <font-awesome-icon :icon="['far', 'eye-slash']" v-if="inputType === 'password'" @click="handlePassword" />
            <font-awesome-icon :icon="['far', 'eye']" v-if="inputType === 'text'" @click="handlePassword" /> -->

            <!-- <Bonus password : correction : -->
            <input :type="displayPassword ? 'text' : 'password'" v-model="password" id="password"
              @input="errorMessage = ''">
            <!-- si displayPassword est truthy alors je veux que mon iput soit de type text -->

            <div>
              <font-awesome-icon :icon="['far', 'eye-slash']" v-if="!displayPassword"
                @click="displayPassword = !displayPassword" />
              <font-awesome-icon :icon="['far', 'eye']" v-else @click="displayPassword = !displayPassword" />
              <!-- =  Au click je donne la valeur opposée a displayPassword -->
            </div>

          </div>
        </label>


        <p v-if="isSubmitting">Connexion en cours...</p>
        <button v-else>Se connecter <font-awesome-icon :icon="['fas', 'arrow-right']" /> </button>

        <p v-if="errorMessage" class="textError">{{ errorMessage }}</p>

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

.inputPassword {
  border: 1px solid black;
  display: flex;
  border-radius: 10px
}

.inputPassword div {
  border-left: 1px solid black;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  width: 40px;
}

.inputPassword > input {
  border: none;
  flex: 1;
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

.textError {
  text-align: center;
  color: var(--orange);
}
</style>
