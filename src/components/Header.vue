<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <section>
      <RouterLink :to="{ name: 'home' }">
        <img src="../assets/leboncoin1-assets/logo.svg" alt="" />
      </RouterLink>

      <div>
        <button>Deposez une annonce</button>

        <input type="text" placeholder="Rechercher sur leboncoin" />
        <font-awesome-icon :icon="['fas', 'search']" />
      </div>
      <div>
        <font-awesome-icon :icon="['fas', 'user']" />
        <button>Se connecter</button>
      </div>
    </section>

    <section>
      <p>
        Immobilier <span>.</span> Vehicules <span>.</span> Locations de vacances
        <span>.</span> Emploi <span>.</span> Mode <span>.</span> Maison & Jardin
        <span>.</span> Famiile <span>.</span> Electronique <span>.</span> Loisirs
        <span>.</span> Autres
      </p>
    </section>
  </header>
</template>

<style scoped>
section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
