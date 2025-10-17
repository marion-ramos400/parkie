<script setup>
  import { ref, useTemplateRef, onMounted } from 'vue'
  import { VITE_PARKING_FLOORPLAN } from '@/env.js'
  import parkingSlots from './parking.slots.config.js'
  import ParkingSlot from '@/components/Parking/ParkingSlot.vue'
  import PromptBookConfirm from '@/components/Prompt/PromptBookConfirm.vue'
  
  const floorplan = useTemplateRef('floorplan')
  const promptConfirm = ref({ show: false })

  const showPromptConfirm = (arg) => {
    promptConfirm.value = arg
  }

  const pSlots = ref(parkingSlots)

</script>
<template>
  <h1>Parking</h1>
  <div ref="floorplan" class='floorplan'>
    <ParkingSlot v-for="slot in pSlots"
      :slot="slot"
      @confirm-prompt="(arg) => showPromptConfirm(arg)"
    />

  <PromptBookConfirm 
    :position="promptConfirm"
    @confirm-prompt="(arg) => showPromptConfirm(arg)"
    />

    <img :src="VITE_PARKING_FLOORPLAN" alt=""
      width="752px" height="615px">
    <!-- TODO make this dynamic -->
  </div>
</template>
<style>
  .floorplan {
    position: relative;
    width: 752px;
    height: 615px;
  }
  .floorplan img {
    z-index: -1;
  }

</style>
