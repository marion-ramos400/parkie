<script setup>
  import { ref } from 'vue'
  import NavigationBar from '@/components/Navigation/NavigationBar.vue'

  const email = ref('')

</script>
<template>
  <NavigationBar/>
  <div class="test-content">
    <RouterView name="DashboardView"/>
  </div>
</template>
<style>
</style>
