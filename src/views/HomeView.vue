<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const adsList = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers`,
    )
    console.log(data)
    adsList.value = data.data
    console.log(adsList.value)
  } catch (error) {
    console.log(error.message)
  }
})
</script>

<template>
  <main>
    <p v-if="adsList.length === 0">loading...</p>
    <div v-else>
      <RouterLink v-for="ad in adsList" :key="ad.id" :to="{ name: 'ad', params: { id: ad.id } }">
        <p>{{ ad.attributes.title }}</p>
      </RouterLink>
    </div>
  </main>
</template>
