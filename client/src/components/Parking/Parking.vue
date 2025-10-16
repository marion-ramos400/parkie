<script setup>
  import { ref, useTemplateRef, onMounted } from 'vue'
  import { VITE_PARKING_FLOORPLAN} from '@/env.js'
  import parkingSlots from './parking.slots.config.js'
  import ParkingSlot from '@/components/Parking/ParkingSlot.vue'

  const floorplan = useTemplateRef('floorplan')
  const slots = ref([])
  const checkPos = (e) => {
    console.log(e.pageX, e.pageY)
  }
  const pSlots = ref(parkingSlots)

</script>
<template>
  <h1>Parking</h1>
  <div ref="floorplan" class='floorplan' v-on:click="checkPos">
    <ParkingSlot v-for="slot in pSlots"
      v-bind="slot"
    />
    <img :src="VITE_PARKING_FLOORPLAN" alt=""
      width="752px" height="615px">
    <!-- TODO make this dynamic -->
  </div>
</template>
<style>
  .floorplan {
    width: 752px;
    height: 615px;
  }
  .floorplan img {
    z-index: -1;
  }

</style>
