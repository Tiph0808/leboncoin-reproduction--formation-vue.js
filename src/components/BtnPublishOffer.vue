<script setup>

import { RouterLink } from 'vue-router'
// import { inject } from 'vue'
// const GlobalStore = inject('GlobalStore')

</script>

<template>
  <button>
    <RouterLink :to="{ name: 'publish' }">
      <font-awesome-icon :icon="['far', 'square-plus']" />Déposer une annonce
    </RouterLink>
  </button>


</template>
<style scoped>
button {
  background-color: var(--orange);
  border: none;
  padding: 5px 10px 7px 10px;
  border-radius: 10px;
  color: white;
  font-weight: bold;
}

svg {
  margin-right: 5px;
  box-sizing: content-box;
}

/* On ajoute box-sizing:content-box car au niveau de l'icone car il faut ecraser la pp box sizing:border-box sinon l'icone est trop petit*/
</style>
