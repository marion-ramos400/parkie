<script setup>
  import { ref, onMounted } from 'vue'
  const props = defineProps([
    'x',
    'y',
    'w',
    'h',
    'booked'
  ])

  const isBooked = ref(false)
  
  const bookSlot = () => {
    isBooked.value = true
  }

  onMounted(async () => {
    isBooked.value = props.booked
  })
</script>
<template>
  <div class="vacant"
       :class="{ booked: isBooked }"
       :style="`top:${y}px;left:${x}px`"
       :width="`${w}px`"
       :height="`${h}px`"
       v-on:click="bookSlot"
       >
  </div>
</template>
<style>
  .slot {
    display: block;
    position: absolute;
    width: 26px;/*TODO make these dimensions dynamic*/
    height: 54px;
    background-color: var(--islamic-green);
    z-index: 100;
  }

  .vacant {
    display: block;
    position: absolute;
    width: 26px;/*TODO make these dimensions dynamic*/
    height: 54px;
    background-color: var(--black-olive);
    opacity: 0.5;
    border: 2px solid black;
  }

  .booked {
    background-color: var(--islamic-green);
  }
</style>
