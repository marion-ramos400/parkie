<script setup>
  import { ref } from 'vue'
  import NavigationBar from '@/components/Navigation/NavigationBar.vue'
</script>
<template>
  <NavigationBar/>
  <div class="dashboard">
    <RouterView name="DashboardView"/>
  </div>
</template>
<style>
</style>
