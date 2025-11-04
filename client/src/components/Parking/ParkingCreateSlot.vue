<script setup>
  import { ref, onMounted } from 'vue'
  const props = defineProps([
    'w', 'h'
  ])
  const style = ref(null)

  onMounted(() => {
  console.log(props.x, props.y)
    style.value = {
      width: `${props.w}px`,
      height: `${props.h}px`,
      backgroundColor: 'green',
    }
  })
</script>
<template>
  <div :style="style">
  </div>
</template>
<style>
</style>
