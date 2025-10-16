<script setup>
  import { ref, onMounted } from 'vue'
  const props = defineProps([
    'slot'
  ])

  const isBooked = ref(false)
  
  const bookSlot = () => {
    if (isBooked.value) return;
    console.log('init book process')
  }
  
  const parseStyle = (uiRect) => {
    const { x, y, w, h } = uiRect
    return `top:${y}px`
      + `;left:${x}px`
      + `;width:${w}px`
      + `;height:${h}px`
  }

  onMounted(async () => {
    isBooked.value = props.slot.isBooked
  })

</script>
<template>
  <div class="vacant"
       :class="{ booked: isBooked }"
       :style="parseStyle(slot.uiRect)"
       v-on:click="bookSlot"
       >
  </div>
</template>
<style>
  .slot {
    display: block;
    position: absolute;
    background-color: var(--islamic-green);
    z-index: 100;
  }

  .vacant {
    display: block;
    position: absolute;
    background-color: var(--black-olive);
    opacity: 0.5;
    border: 2px solid black;
  }

  .booked {
    background-color: var(--coral-pink);
  }
</style>
