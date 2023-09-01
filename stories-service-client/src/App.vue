<script setup>
import { RouterLink, RouterView } from 'vue-router'
import "./styles/normalize.css";
import "./styles/main.css";
</script>

<template>
  <header>
    <div class="wrapper__nav">
      <nav v-if="auth">
        <RouterLink to="/">Main</RouterLink>
        <RouterLink to="/authors">Authors</RouterLink>
        <RouterLink to="/my-stories">My stories</RouterLink>
        <RouterLink to="/my-subscribes">My subscribes</RouterLink>
        <RouterLink to="/profile-settings">
          <img src="../public/profile.png" alt="Profile" class="profile-link">
        </RouterLink>
        <button @click="exit">Exit</button>
      </nav>
      <nav v-if="!auth">
        <RouterLink to="/">Main</RouterLink>
        <RouterLink to="/authors">Authors</RouterLink>
        <RouterLink to="/auth">Auth</RouterLink>
        <RouterLink to="/signup">Sign up</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView/>
</template>

<script>
  export default {
    data () {
      return {
        auth: false
      }
    },
    methods: {
      exit() {
        localStorage.setItem("authToken", "");

        window.location.reload();
      }
    },
    async beforeMount() {
        if(!localStorage.getItem("authToken")) {
          this.auth = false
        } else {
          try {
            const response = await this.axios.get("/auth");

            this.auth = true;
          } catch (e) {
            this.auth = false;
          }
        }
    }
  }
</script>

<style scoped>
  .wrapper__nav {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    height: 40px;
  }
  .wrapper__nav nav {
    width: 100%;
    max-width: 1000px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .wrapper__nav nav a {
    color: #fff;
    text-decoration: none;
  }
  .profile-link {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
</style>
