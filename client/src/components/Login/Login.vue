<script setup>
</script>
<template>
  <div class="login">
    <div>
      <h3>Login</h3>
      <form>
          <input type="text" placeholder="USERNAME"/>
          <input type="password" placeholder="PASSWORD"/>
          <button type="submit">Login</button>
      </form>
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
  padding: 14.5px 0;
  width: 100%;
  margin: 2rem 0;
  border-radius: 6px;
  border: none;
}



</style>
