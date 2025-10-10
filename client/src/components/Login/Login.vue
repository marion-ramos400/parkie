<script setup>
  import { ref } from 'vue'
  import axios from 'axios'

  const error = ref(null)
  const username = ref('')
  const pwd = ref('')
  const emit = defineEmits(['login'])

  const validateUsernamePwd = (username, password) => {
    if(!username && !password){
      error.value = "Please fill-up the fields"
      return
    }
    if(!username) error.value = "Username is required"
    else if(!password) error.value = "Password is required"
    else error.value = ""
  }

  const handleLogin = (e) => {
    validateUsernamePwd(username.value, pwd.value)
    //TODO add login api call
    axios.post(
      'http://127.0.0.1:3000/users/login', 
    {
      email: username.value,
      password: pwd.value
    })
    .then(res => {
      //store jwt to session storage
      sessionStorage.setItem('token', res.data.token)
    })
    .catch(err => {
      console.log('captured error')
      console.error(err)
    })
    .finally(() => {
      console.log('huuuh?')
    })
//    emit('login')
  }
</script>
<template>
  <div class="login">
    <div>
      <h3>Login</h3>
      <form v-on:submit.prevent="handlelogin">
        <input 
          type="text" 
          placeholder="username"
          v-model="username"/>
        <input 
          type="password" 
          placeholder="password"
          v-model="pwd"/>
        <button type="submit">login</button>
      </form>
      <div class="forgot-password">
        <a href="">forgot password</a>
        <p v-if="error">{{ error }}</p>
      </div>
      <RouterLink to="/dashboard">dash</RouterLink>
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
