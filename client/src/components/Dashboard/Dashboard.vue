<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { VITE_PARKIE_SERVER } from '@/env.js'

  const email = ref('')
  const testPost = (endpoint) => {
    axios.post(
      endpoint, {}, { withCredentials: true })
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.error(error.message)
      })
  }

  const verifyJwt = () => {
    //TODO make axios instance for DRY
    testPost(VITE_PARKIE_SERVER + '/users/verify')
  }

  const refreshJwt = () => {
    testPost(VITE_PARKIE_SERVER + '/users/refresh')
  }

  const logOut = () => {
    testPost(VITE_PARKIE_SERVER + '/users/logout')
  }

</script>
<template>
  <h1>Hi TETST</h1>
  <button v-on:click="verifyJwt">Test JWT</button>
  <button v-on:click="refreshJwt">Refresh</button>
  <button v-on:click="logOut">LogOut</button>
</template>
<style>
</style>
