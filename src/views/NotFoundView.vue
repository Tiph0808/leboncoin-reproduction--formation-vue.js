<script setup>
import { RouterLink } from 'vue-router';


</script>
<template>
  <main>
    <h1>OOPS....it looks like the page doesn't exist</h1>

    <RouterLink :to="{ name: 'home' }">Retourner sur la page d'accueil</RouterLink>


  </main>
</template>

<style scoped>
main {
  padding: 80px;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  flex-direction: column;
  align-items: center;
}


h1 {
  font-size: 20px;
  font-weight: bold;

  margin-bottom: 100px;
}

a {
  text-decoration: underline;
  color: var(--orange);
  font-size: 20px;
  font-weight: bold;
}
</style>
