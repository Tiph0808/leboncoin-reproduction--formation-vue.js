<!-- eslint-disable vue/multi-word-component-names -->
<script setup></script>
<template>
  <footer>
    <p class="container">
      Made by <a href="https://github.com/Tiph0808" target="blank">Tiphaine Geffriaud </a>with
      <a href="https://vuejs.org/guide/introduction.html" target="blank">Vue.js</a>
    </p>
  </footer>
</template>
<style scoped>
footer {
  height: var(--footer-height);
  background-color: var(--light-grey);
}

p {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

a {
  font-weight: bold;
}
</style>
