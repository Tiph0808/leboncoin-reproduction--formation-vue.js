<!-- eslint-disable vue/multi-word-component-names -->

<script setup>



import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps(['sort', 'pricemin', 'pricemax', 'title', 'page', 'numOfPages'])


const changePage = (num) => {
  const queries = { ...props }

  delete queries.numOfPages

  queries.page = num

  router.push({ name: 'home', query: queries })
}

</script>




<template>
  <section>
    <font-awesome-icon :icon="['fas', 'angle-left']" @click="changePage(page - 1)" v-if="page > 1" />
    <font-awesome-icon :icon="['fas', 'angle-left']" v-else class="disabled" />
    <div>

      <p v-for="num in numOfPages" :key="num" @click="changePage(num)" :class="{ selected: num === page }">{{ num }}</p>

    </div>
    <font-awesome-icon :icon="['fas', 'angle-right']" @click="changePage(page + 1)" v-if="page < numOfPages" />
    <font-awesome-icon :icon="['fas', 'angle-right']" v-else class="disabled" />

  </section>
</template>



<style scoped>
section {
  display: flex;
  align-items: center;
  margin-top: 30px;
  gap: 10px;
}

section > div {
  display: flex;

}

p {
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  /* border: 1px solid red; */
}

.selected {
  /* color: red; */
  color: white;
  background-color: black;

}

svg {
  cursor: pointer;
}


.disabled {
  color: rgb(197, 195, 195);
  cursor: auto;
}
</style>
