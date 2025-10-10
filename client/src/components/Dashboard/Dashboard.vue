<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { VITE_PARKIE_SERVER } from '@/env.js'
  import { 
   apiRefreshUser, 
   apiVerifyJwt,
   apiLogOutUser } from '@/api/api.users.js'

  const email = ref('')

  const verifyJwt = async () => {
    await apiVerifyJwt().then(data=>console.log(data))
  }

  const refreshJwt = async () => {
    await apiRefreshUser().then(data=>console.log(data))
  }

  const logOut = async () => {
    //remove cookies
    await apiLogOutUser().then(data=>console.log(data))
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
