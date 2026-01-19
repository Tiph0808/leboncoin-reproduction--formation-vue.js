<script setup></script>

<template>
  <button><font-awesome-icon :icon="['far', 'square-plus']" />Déposer une annonce</button>
</template>
<style scoped>
button {
  background-color: var(--orange);
  border: none;
  padding: 5px 10px 7px 10px;
  border-radius: 10px;
  color: white;
  font-family: inherit;
  font-weight: bold;
  font-size: inherit; /* par defaut les boutons ont une taille de police plus petite, ici on veut qu'elle soit identique au reste du header */
}

svg {
  margin-right: 5px;
  box-sizing: content-box;
}

/* On ajoute box-sizing:content-box car au niveau de l'icone car il faut ecraser la pp box sizing:border-box sinon l'icone est trop petit*/
</style>
