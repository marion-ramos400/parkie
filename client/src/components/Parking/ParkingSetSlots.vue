<script setup>
  import { ref, onMounted } from 'vue'
  import ParkingCreateSlotArray from '@/components/Parking/ParkingCreateSlotArray.vue'

  import { VITE_PARKING_FLOORPLAN } from '@/env.js' //TODO remove
  import { getIntPx } from './utils.js'

  const State = {
    INIT: 0,
    DRAW: 1,
    EDIT_SLOTGROUP: 2,
  }

  const props = defineProps([
    'fpname',
    'floor',
    'bldg',
  ])

  const state = ref(State.INIT)
  const slotGroup = ref([])

  const imgW = ref('752px')
  const imgH = ref('615px')
  const parkSlot = ref({})
  const startLeft = ref(null)
  const startTop = ref(null)

  const imgData = ref(null)

  const drawStart = (e) => {
    if(state.value === State.INIT) {
      startLeft.value = e.offsetX
      startTop.value = e.offsetY

      parkSlot.value.top = `${e.offsetY}px`
      parkSlot.value.left = `${e.offsetX}px`
      parkSlot.value.width = null
      parkSlot.value.height = null

      state.value = State.DRAW
    }
  }

  const draw = (e) => {
    if (state.value === State.DRAW) {
      const diffX = Math.abs(e.offsetX - startLeft.value)
      if (e.offsetX < startLeft.value) {
        parkSlot.value.left = `${e.offsetX}px`
      }
      parkSlot.value.width = `${diffX}px`

      const diffY = Math.abs(e.offsetY - startTop.value)
      if (e.offsetY < startTop.value) {
        parkSlot.value.top = `${e.offsetY}px`
      }
      parkSlot.value.height = `${diffY}px`
    }
  }

  const drawDone = (e) => {
    if(state.value === State.DRAW) {
      slotGroup.value.push({
        startX: getIntPx(parkSlot.value.left),
        startY: getIntPx(parkSlot.value.top),
        slotWidth: getIntPx(parkSlot.value.width),
        slotHeight: getIntPx(parkSlot.value.height)
      })
      
      state.value = State.EDIT_SLOTGROUP
      parkSlot.value.width = "0px"
      parkSlot.value.height = "0px"
    }
  }


  const resetState = () => {
    state.value = State.INIT
  }


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
<!--       <img v-if="imgData" :src="imgData" alt="floorplan image"/> -->
      <div
        class='img-overlay'
        :style="{width:'752px',height:'615px'}"
          v-on:mousedown="drawStart"
          v-on:mousemove="draw"
          v-on:mouseup="drawDone"
        >
        <div 
          class="draw-slot"
          :style="parkSlot"
          >
        </div>
        
        <ParkingCreateSlotArray
          v-for="item in slotGroup"
          v-bind="item"
          @doneEdit="resetState"
        />
      </div>
      <img :src="VITE_PARKING_FLOORPLAN" alt=""
        :width="imgW" :height="imgH"
        ><!-- TEMP -->
  </div>

</template>
<style>
  .fp-img-container {
    z-index: 0; 
  }

  .img-overlay {
    background-color: #00aa0012; 
    position: absolute;
    z-index: 10;
  }

  .draw-slot {
    position: absolute;
    background-color: blue;
  }
</style>
