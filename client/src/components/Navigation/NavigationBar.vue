<script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { apiLogOutUser } from '@/api/api.users.js'
  
  const router = useRouter()
  const navMenu = reactive({
    home: {
      url: "/dashboard/home",
      text: "Home"
    },
    parking: {
      url: "/dashboard/parking",
      text: "Parking"
    },
    office: {
      url: "/dashboard/office",
      text: "Office"
    },
//    logout: {
//      url: "/",
//      text: "LogOut"
//    },
  })

  const logout = async (e) => {
    await apiLogOutUser() 
    router.push('/')
  }
</script>
<template>
  <div class="navbar">
    <RouterLink 
      v-for="item in navMenu" 
      :to="item.url">
    {{ item.text }}
    </RouterLink>
    <button @click="logout">Log Out</button>
  </div>
</template>
<style>
  .navbar {
    margin: 0;
    padding: 0;
    width: 200px;
    background-color: red;
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    overflow: auto;
  }

  .navbar a {
    display: block;
  }

  @media screen and (max-width: 700px) {
    .navbar {
      width: 100%;
      height: auto;
      position: fixed;
    }

    .navbar a {
      display: inline;
    }
  }

</style>
