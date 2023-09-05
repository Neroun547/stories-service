<script setup>
import { RouterLink, RouterView } from 'vue-router'
import "./styles/normalize.css";
import "./styles/main.css";
</script>

<template>
  <header>
    <div class="wrapper__nav">
      <nav v-if="auth">
        <RouterLink to="/">{{getTranslateByKeyLocal("system.ui.translate.nav.main").setting_value}}</RouterLink>
        <RouterLink to="/authors">{{getTranslateByKeyLocal("system.ui.translate.nav.authors").setting_value}}</RouterLink>
        <RouterLink to="/my-stories">{{getTranslateByKeyLocal("system.ui.translate.nav.my_stories").setting_value}}</RouterLink>
        <RouterLink to="/my-subscribes">{{getTranslateByKeyLocal("system.ui.translate.nav.my_subscribes").setting_value}}</RouterLink>
        <RouterLink to="/profile-settings">
          <img :src="'/avatars/' + avatar" alt="Profile" class="profile-link" v-if="avatar">
          <img src="/profile.png" alt="Profile" class="profile-link" v-if="!avatar">
        </RouterLink>
        <select @change="changeLanguage" v-model="selectedLanguage">
          <option value="uk">{{getTranslateByKeyLocal("system.ui.translate.ukrainian").setting_value}}</option>
          <option value="en">{{getTranslateByKeyLocal("system.ui.translate.english").setting_value}}</option>
        </select>
        <button @click="exit" class="exit-btn">{{getTranslateByKeyLocal("system.ui.translate.logout").setting_value}}</button>
      </nav>
      <nav v-if="!auth">
        <RouterLink to="/">{{getTranslateByKeyLocal("system.ui.translate.nav.main").setting_value}}</RouterLink>
        <RouterLink to="/authors">{{getTranslateByKeyLocal("system.ui.translate.nav.authors").setting_value}}</RouterLink>
        <RouterLink to="/auth">{{getTranslateByKeyLocal("system.ui.translate.nav.auth").setting_value}}</RouterLink>
        <RouterLink to="/signup">{{getTranslateByKeyLocal("system.ui.translate.nav.signup").setting_value}}</RouterLink>
        <select @change="changeLanguage" v-model="selectedLanguage">
          <option value="uk">{{getTranslateByKeyLocal("system.ui.translate.ukrainian").setting_value}}</option>
          <option value="en">{{getTranslateByKeyLocal("system.ui.translate.english").setting_value}}</option>
        </select>
      </nav>
    </div>
  </header>

  <div class="wrapper__content">
    <RouterView/>
  </div>
</template>

<script>
  import { getTranslateByKey } from "./components/common/getTranslateByKey.js";
  export default {
    data () {
      return {
        auth: false,
        avatar: "",
        selectedLanguage: "uk"
      }
    },
    methods: {
      exit() {
        localStorage.setItem("authToken", "");

        window.location.reload();
      },
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key);
      },
      async changeLanguage(e) {
        this.selectedLanguage = e.target.value;

        const translate = (await this.axios.get(`/settings/translate/${this.selectedLanguage}`)).data;

        localStorage.setItem("selectedLanguage", e.target.value);
        localStorage.setItem("translate", JSON.stringify(translate));

        if(this.auth) {
          await this.axios.patch("/users/change-language/" + this.selectedLanguage);
        }
        window.location.reload();
      }
    },
    async created() {

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
      if(!localStorage.getItem("translate")) {
        const translate = (await this.axios.get(`/settings/translate/${this.selectedLanguage}`)).data;

        localStorage.setItem("translate", JSON.stringify(translate));

        window.location.reload();
      }
      if(localStorage.getItem("selectedLanguage")) {
        this.selectedLanguage = localStorage.getItem("selectedLanguage");
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
