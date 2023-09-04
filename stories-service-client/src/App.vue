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
          <img :src="'/avatars/' + avatar" alt="Profile" class="profile-link" v-if="avatar">
          <img src="/profile.png" alt="Profile" class="profile-link" v-if="!avatar">
        </RouterLink>
        <button @click="exit" class="exit-btn">Exit</button>
      </nav>
      <nav v-if="!auth">
        <RouterLink to="/">Main</RouterLink>
        <RouterLink to="/authors">Authors</RouterLink>
        <RouterLink to="/auth">Auth</RouterLink>
        <RouterLink to="/signup">Sign up</RouterLink>
      </nav>
    </div>
  </header>

  <div class="wrapper__content">
    <RouterView/>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        auth: false,
        avatar: ""
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
            const user = (await this.axios.get("/auth/user-info")).data;

            this.avatar = user.avatar;

            this.auth = true;
          } catch (e) {
            this.auth = false;
          }
        }
    }
  }
</script>

<style scoped>
  .exit-btn {
    cursor: pointer;
  }
  .wrapper__nav {
    position: fixed;
    width: 100%;
    top: 0;
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
  .wrapper__content {
    display: block;
    margin-top: 100px;
    margin-bottom: 100px;
  }
</style>
