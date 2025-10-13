<script setup>
  import { ref, onMounted } from 'vue'
  import { apiGetUser } from '@/api/api.users.js'

  const username = ref('')
  const bookings = ref([])

  onMounted(async () => {
    await apiGetUser()
    .then(res => {
      username.value = res.email
      bookings.value = res.bookings
    })
    .catch(err => {
      console.error(err)
    })
  })
</script>
<template>
  <h1>Welcome, {{ username }}</h1>
  <p v-if="bookings.length < 1">
    You don't have any bookings for today.
  </p>
</template>
<style>
</style>
