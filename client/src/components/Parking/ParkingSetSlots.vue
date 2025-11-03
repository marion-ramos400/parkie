<script setup>
  import { ref, onMounted } from 'vue'

  import { VITE_PARKING_FLOORPLAN } from '@/env.js' //TODO remove

  const props = defineProps([
    'fpname',
    'floor',
    'bldg',
  ])

  const imgW = ref('752px')
  const imgH = ref('615px')
  const mouseHold = ref(false)
  const parkSlot = ref({})
  const startLeft = ref(null)
  const startTop = ref(null)
  const allowDraw = ref(true)

  const isDragging = ref(false)


  const imgData = ref(null)

  const drawStart = (e) => {
    if(allowDraw.value) {
      parkSlot.value.pointerEvents = 'none'
      mouseHold.value = true
      startLeft.value = e.offsetX
      startTop.value = e.offsetY

      parkSlot.value.top = `${e.offsetY}px`
      parkSlot.value.left = `${e.offsetX}px`
      parkSlot.value.width = null
      parkSlot.value.height = null
    }
  }

  const getIntPx = (item) => {
    return parseInt(item.split('px')[0])
  }

  const drawFinish = (e) => {
    mouseHold.value = false
    allowDraw.value = false
    parkSlot.value.pointerEvents = 'auto'
  }



  const mouseMove = (e) => {
    //TODO try using e.movementX and e.movementY instead
    if (mouseHold.value) {
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

  const dragging = (e) => {
    isDragging.value = true
  }

  const dragend =(e) => {
    isDragging.value = false
  }

  const changePos = (e) => {
    if(isDragging.value) {
      const pos = [e.movementX, e.movementY]
      const left = getIntPx(parkSlot.value.left)
      const top = getIntPx(parkSlot.value.top)
      parkSlot.value.left = `${left + pos[0]}px`
      parkSlot.value.top = `${top + pos[1]}px`
    }
  }

  onMounted(() => {
    const fpimg = sessionStorage.getItem("fpimg")
    imgData.value = fpimg
    sessionStorage.removeItem("fpimg")
  })


//          draggable="true"
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
          v-on:mousemove="mouseMove"
          v-on:mouseup="drawFinish"
        >
        <div class="divtest"
          :style="parkSlot"
          v-on:mousedown="dragging"
          v-on:mouseup="dragend"
          v-on:mousemove="changePos"
          v-on:mouseout="dragend"
          >

        </div>
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

  .divtest {
    position: absolute;
    background-color: blue;
/*     pointer-events: none; */
/*     width: 24px; */
/*     height: 24px; */
/*     top: 0; */
/*     left: 0; */
  }
</style>
