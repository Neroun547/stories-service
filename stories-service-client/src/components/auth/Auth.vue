<template>
  <form class="mt-200 form__component" @submit="auth">
    <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.auth.username_or_email').setting_value" v-model="authForm.usernameOrEmail" required>
    <input type="password" :placeholder="getTranslateByKeyLocal('system.ui.translate.password').setting_value" v-model="authForm.password" required>
    <button type="submit">{{getTranslateByKeyLocal("system.ui.translate.nav.auth").setting_value}}</button>
  </form>
  <div class="form__component-error-message" v-if="authError">
    {{authError}}
  </div>
</template>

<script>
import "../../styles/components/form.component.css";
import { getTranslateByKey } from "../common/getTranslateByKey.js";

export default {
  data() {
    return {
      authForm: {
        usernameOrEmail: "",
        password: ""
      },
      authError: ""
    }
  },
  methods: {
    getTranslateByKeyLocal(key) {
      return getTranslateByKey(key);
    },
    async auth(e) {
      e.preventDefault();

      this.authError = "";

      try {
        const response = await this.axios.post("/auth", {
          usernameOrEmail: this.authForm.usernameOrEmail,
          password: this.authForm.password
        });
        localStorage.setItem("authToken", response.data.token);

        window.location.href = "/";
      } catch(e) {
        this.authError = e.response.data.message;
      }
    }
  }
}
</script>

