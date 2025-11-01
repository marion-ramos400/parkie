<script setup>
  const props = defineProps([
    'fpname',
    'floor',
    'bldg'
  ])
</script>
<template>
  <div>
    <p>Floorplan: {{ fpname }}</p>
    <p>Floor: {{ floor }}</p>
    <p>Building: {{ bldg }}</p>
  </div>

</template>
<style>
</style>
