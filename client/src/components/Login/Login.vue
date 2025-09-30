<script setup>
</script>
<template>
  <div class="login">
    <div>
      <h3>Login</h3>
      <form>
          <input class="login-input" type="text" placeholder="USERNAME"/>
          <input type="password" placeholder="PASSWORD"/>
          <button type="submit">Login</button>
      </form>
      <div class="forgot-password">
        <a href="">Forgot Password</a>
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
