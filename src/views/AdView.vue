<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

console.log(props)

const adInfos = ref(null)

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers/${props.id}`,
    )
    adInfos.value = data.data
    console.log(adInfos.value)
  } catch (error) {
    console.log(error)
  }
})
</script>
<template>
  <p v-if="!adInfos">Loading...</p>
  <div v-else>
    <p>{{ adInfos.attributes.description }}</p>
    <p>{{ adInfos.attributes.price }}</p>
  </div>
</template>
