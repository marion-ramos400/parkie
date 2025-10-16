<script setup>
  import { onMounted } from 'vue'

  const props = defineProps([
    'position'
  ])

  const emit = defineEmits([
    'confirmPrompt'
  ])

  const setPosition = (pos) => {
    return `left:${pos.x}px`
      + `;top:${pos.y}px`
  }

  const hideSelf = () => {
    emit('confirmPrompt', { show: false })
  }


  onMounted(async () => {
    console.log(props.position.x)
  })
</script>
<template>
  <div class="prompt-confirm"
    :style="setPosition(position)">
    <p>Book this slot?</p>
    <button>Book</button>
    <button v-on:click="hideSelf">Cancel</button>
  </div>
</template>
<style>
  .prompt-confirm {
    display: block;
    position: absolute;
    background-color: white;
    border: 1px solid black;
    z-index: 100;
  }
</style>
