<script setup>
import BtnPublishOffer from './BtnPublishOffer.vue'
</script>

<template>
  <div class="bloc">
    <img src="../assets/leboncoin1-assets/onde-corail.svg" alt="" />
    <div>
      <p>C'est le moment de vendre</p>
      <BtnPublishOffer />
    </div>
    <img src="../assets/leboncoin1-assets/feuille-bleue.svg" alt="" />
  </div>
</template>

<style scoped>
.bloc {
  /* border: 1px solid red; */
  display: flex;
  width: 100%;
  background-color: var(--light-coral);
  margin-bottom: 40px;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
}
.bloc > div {
  display: flex;
  gap: 20px;
  align-items: center;
}
img:first-child {
  border-radius: 10px 0px 0px 10px;
}
img:last-child {
  border-radius: 0 10px 10px 0;
}
p {
  font-size: 20px;
  font-weight: bold;
}
</style>
