<script setup>
import { onMounted, ref, inject } from 'vue';
import axios from 'axios';
import BtnPublishOffer from '@/components/BtnPublishOffer.vue';

const GlobalStore = inject('GlobalStore')

const profileInfos = ref(null)

const offers = ref([])



onMounted(async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${GlobalStore.userInfos.value.id}?populate[0]=offers&populate[1]=avatar`, {
      headers: {
        Authorization: `Bearer ${GlobalStore.userInfos.value.token}`
      }
    })
    console.log(data)
    profileInfos.value = data
    offers.value = data.offers

  } catch (error) {
    console.log('catch ProfileView : ', error.message)
  }
})



</script>

<template>
  <main>
    <p>Profile</p>
    <p>{{ profileInfos?.username }}</p>
    <img :src=profileInfos?.avatar?.url alt="">

    <div v-for="offer in profileInfos?.offers" :key="offer.id">
      <RouterLink :to="{ name: 'offer', params: { id: offer.id } }">
        <p>{{ offer?.title }}</p>
      </RouterLink>

      <button>
        <RouterLink :to="{ name: 'updateOffer', params: { id: offer.id } }">
          Modifier mon annonce
        </RouterLink>
      </button>


    </div>

    <BtnPublishOffer />

  </main>
</template>

<style scoped></style>
