<script setup>
  import { ref } from 'vue'
  import { VITE_PARKING_FLOORPLAN } from '@/env.js'
  import ParkingSlot from '@/components/Parking/ParkingSlot.vue'

</script>
<template>
  <h1>Parking Admin</h1>
  <div>
    <img :src="VITE_PARKING_FLOORPLAN" alt=""
      width="752px" height="615px">
  </div>

</template>
<style>
</style>
