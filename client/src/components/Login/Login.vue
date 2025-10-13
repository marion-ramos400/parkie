<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { VITE_PARKIE_SERVER } from '@/env.js'
  import { apiLoginUser } from '@/api/api.users.js'

  const error = ref(null)
  const email = ref('')
  const pwd = ref('')
  const emit = defineEmits(['login'])
  const router = useRouter()

  const handleLogin = async (e) => {
    await apiLoginUser(
        email.value, pwd.value
      )
      .then(resData => {
        if (resData) {
          router.push('/dashboard')
        }
      })
  }
</script>
<template>
  <div class="login">
    <div>
      <h3>Login</h3>
      <form v-on:submit.prevent="handleLogin">
        <input 
          type="text" 
          placeholder="email"
          required=true
          v-model="email"/>
        <input 
          type="password" 
          placeholder="password"
          required=true
          v-model="pwd"/>
        <button type="submit">login</button>
      </form>
      <div class="forgot-password">
        <a href="">forgot password</a>
        <p v-if="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
<style>
@import '@/assets/main.css';
.login {
 background: var(--platinum);
 position: relative;
 width: 22.2rem;
 border-radius: 10px;
}

.login div {
  padding: 2rem;
}

.login form input {
  display: block;
  padding: 14px;
  width: 100%;
  margin: 2rem 0;
  box-sizing: border-box;
  border-radius: 6px;
  border: none;
  outline: none;
}

.login form button {
  display: block;
  padding: 13px;
  width: 100%;
}

.forgot-password {
  align-items: center;
  text-align: center;
}

</style>
