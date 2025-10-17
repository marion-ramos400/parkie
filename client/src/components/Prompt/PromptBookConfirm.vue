<script setup>
  import { ref, onMounted } from 'vue'
  import ModalReserveSlot from '@/components/Modal/ModalReserveSlot.vue'

  const props = defineProps([
    'position'
  ])

  const emit = defineEmits([
    'confirmPrompt'
  ])
  
  const showModal = ref(false)

  const showModalReserve = () => {
    hideSelf()
    showModal.value = true 
  }

  const setPosition = (pos) => {
    const visible = pos.show ? "visible" : "hidden"
    return `left:${pos.x}px`
      + `;top:${pos.y}px`
      + `;visibility:${visible}`
  }

  const hideSelf = () => {
    emit('confirmPrompt', { show: false })
  }


  onMounted(async () => {
  })
</script>
<template>
  <div class="prompt-confirm"
    :style="setPosition(position)">
    <p>Book this slot?</p>
    <button v-on:click="showModalReserve">Book</button>
    <button v-on:click="hideSelf">Cancel</button>
  </div>
  <ModalReserveSlot v-if="showModal" @hide="()=>showModal=false"/>
</template>
<style>
  .prompt-confirm {
    display: block;
    position: absolute;
    background-color: white;
    border: 1px solid black;
    z-index: 5;
  }
</style>
