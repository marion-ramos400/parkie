<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const navMenu = reactive({
    home: {
      url: "/dashboard/home",
      text: "Home",
    },
    parking: {
      url: "/dashboard/parking",
      text: "Parking"
    },
    office: {
      url: "/dashboard/office",
      text: "Office"
    },
    logout: {
      url: "/",
      text: "Log Out"
    }
  })
  onMounted(() => {
    router.push(navMenu.home.url)
  })

</script>
<template>
  <div class="navbar">
    <RouterLink 
      v-for="item in navMenu" 
      :to="item.url"
      activeClass="active">
    {{ item.text }}
    </RouterLink>
  </div>
</template>
<style>
  .navbar {
    margin: 0;
    padding: 0;
    width: 200px;
    background-color: var(--cambridge-blue-2);
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    overflow: auto;
  }

  .navbar a {
    display: block;
    text-decoration: none;
    color: black;
    font-size: 20px;
    padding: 24px;
  }

  .navbar a.active {
    background: var(--hunter-green);
    color: white;
  }

  .navbar a:hover:not(.active) {
    background: var(--onyx);
    color: white;
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
