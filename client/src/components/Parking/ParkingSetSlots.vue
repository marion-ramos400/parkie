<script setup>
  import { ref, onMounted } from 'vue'

  const props = defineProps([
    'fpname',
    'floor',
    'bldg',
  ])

  const imgData = ref(null)

  onMounted(() => {
    const fpimg = sessionStorage.getItem("fpimg")
    imgData.value = fpimg
    sessionStorage.removeItem("fpimg")
  })

</script>
<template>
  <div>
    <p>Floorplan: {{ fpname }}</p>
    <p>Floor: {{ floor }}</p>
    <p>Building: {{ bldg }}</p>
    <img v-if="imgData" :src="imgData" alt="floorplan image"/>
  </div>

</template>
<style>
</style>
