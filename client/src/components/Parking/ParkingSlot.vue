<script setup>
  import { ref, onMounted, computed } from 'vue'

  const props = defineProps([
    'slot'
  ])
  const emit = defineEmits([
    'confirmPrompt'
  ])

  const isBooked = ref(false)
  const isHover = ref(false)
  
  const bookSlot = () => {
    if (isBooked.value) return;
    const { uiRect } = props.slot
    const { w, h } = uiRect
    const xpos = uiRect.x + w/2
    const ypos = uiRect.y + h/2
    emit('confirmPrompt', { x: xpos, y: ypos, show: true })
  }
  
  const parseStyle = (uiRect) => {
    const { x, y, w, h } = uiRect
    return `left:${x}px`
      + `;top:${y}px`
      + `;width:${w}px`
      + `;height:${h}px`
  }

  const hoverColor = (active) => {
    if (isBooked.value) return;
    isHover.value = active; 
  }

  const setDivColor = computed(() => {
    if (isHover.value) return "hovered";
    if (isBooked.value) return "booked";
  })

  onMounted(async () => {
    isBooked.value = props.slot.isBooked
  })

</script>
<template>
  <div class="slot"
       :class="setDivColor"
       :style="parseStyle(slot.uiRect)"
       v-on:click="bookSlot"
       v-on:mouseover="()=>hoverColor(true)"
       v-on:mouseout="()=>hoverColor(false)"
       >
  </div>
</template>
<style>
  .slot {
    display: block;
    position: absolute;
    background-color: var(--black-olive);
    opacity: 0.5;
    border: 2px solid black;
  }

  .booked {
    background-color: var(--coral-pink);
  }

  .hovered {
    background-color: var(--celadon);
  }
</style>
