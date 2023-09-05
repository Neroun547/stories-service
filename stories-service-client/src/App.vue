<script setup>
import { RouterLink, RouterView } from 'vue-router'
import "./styles/normalize.css";
import "./styles/main.css";
</script>

<template>
  <header v-if="!mobileVersion">
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

  <header v-if="mobileVersion">
    <div class="wrapper__nav">
      <nav v-if="auth">
        <button class="burger-menu-button" @click="showBurgerMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <RouterLink to="/">{{getTranslateByKeyLocal("system.ui.translate.nav.main").setting_value}}</RouterLink>
        <RouterLink to="/authors">{{getTranslateByKeyLocal("system.ui.translate.nav.authors").setting_value}}</RouterLink>
        <select @change="changeLanguage" v-model="selectedLanguage">
          <option value="uk">{{getTranslateByKeyLocal("system.ui.translate.ukrainian").setting_value}}</option>
          <option value="en">{{getTranslateByKeyLocal("system.ui.translate.english").setting_value}}</option>
        </select>
        <button @click="exit" class="exit-btn">{{getTranslateByKeyLocal("system.ui.translate.logout").setting_value}}</button>
      </nav>
      <nav v-if="!auth">
        <button class="burger-menu-button" @click="showBurgerMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <RouterLink to="/">{{getTranslateByKeyLocal("system.ui.translate.nav.main").setting_value}}</RouterLink>
        <RouterLink to="/authors">{{getTranslateByKeyLocal("system.ui.translate.nav.authors").setting_value}}</RouterLink>
        <select @change="changeLanguage" v-model="selectedLanguage">
          <option value="uk">{{getTranslateByKeyLocal("system.ui.translate.ukrainian").setting_value}}</option>
          <option value="en">{{getTranslateByKeyLocal("system.ui.translate.english").setting_value}}</option>
        </select>
      </nav>
    </div>
    <div class="wrapper__burger-menu" :style="{ left: burgerMenuLeftPositionInPercent + '%'  }" v-if="!auth">
      <RouterLink to="/auth">{{getTranslateByKeyLocal("system.ui.translate.nav.auth").setting_value}}</RouterLink>
      <RouterLink to="/signup">{{getTranslateByKeyLocal("system.ui.translate.nav.signup").setting_value}}</RouterLink>
    </div>
    <div class="wrapper__burger-menu" :style="{ left: burgerMenuLeftPositionInPercent + '%'  }" v-if="auth">
      <RouterLink to="/profile-settings">
        <img :src="'/avatars/' + avatar" alt="Profile" class="profile-link" v-if="avatar">
        <img src="/profile.png" alt="Profile" class="profile-link" v-if="!avatar">
      </RouterLink>
      <RouterLink to="/my-stories">{{getTranslateByKeyLocal("system.ui.translate.nav.my_stories").setting_value}}</RouterLink>
      <RouterLink to="/my-subscribes">{{getTranslateByKeyLocal("system.ui.translate.nav.my_subscribes").setting_value}}</RouterLink>
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
        selectedLanguage: "uk",
        mobileVersion: false,
        burgerMenuLeftPositionInPercent: -50
      }
    },
    methods: {
      exit() {
        localStorage.setItem("authToken", "");

        window.location.reload();
      },
      showBurgerMenu() {
        if(this.burgerMenuLeftPositionInPercent < 0) {
          const interval = setInterval(() => {

            if(this.burgerMenuLeftPositionInPercent < 0) {
              this.burgerMenuLeftPositionInPercent += 1;
            } else {
              clearInterval(interval);
            }
          }, 5);
        } else {
          const interval = setInterval(() => {

            if(this.burgerMenuLeftPositionInPercent > -50) {
              this.burgerMenuLeftPositionInPercent -= 1;
            } else {
              clearInterval(interval);
            }
          }, 5);
        }
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

      if(window.matchMedia("(max-width: 1080px)").matches) {
        this.mobileVersion = true;
      }
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
  .wrapper__burger-menu {
    position: fixed;
    top: 40px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #000000de;
    width: 50%;
  }
  .wrapper__burger-menu a {
    color: #fff;
    margin-top: 100px;
    text-align: center;
  }
  .burger-menu-button {
    cursor: pointer;
  }
  .burger-menu-button span {
    display: block;
    width: 30px;
    height: 2px;
    background-color: #000;
    margin: 5px auto;
  }
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

  @media screen and (max-width: 1080px) {
    .profile-link {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }
  }
</style>
