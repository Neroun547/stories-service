<template>
  <form class="mt-200 form__component" @submit="signup">
    <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.your_name').setting_value" v-model="signupForm.name" required>
    <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.username').setting_value" v-model="signupForm.username" required>
    <input type="email" :placeholder="getTranslateByKeyLocal('system.ui.translate.email').setting_value" v-model="signupForm.email" required>
    <input type="password" :placeholder="getTranslateByKeyLocal('system.ui.translate.password').setting_value" v-model="signupForm.password" required>
    <button type="submit">{{getTranslateByKeyLocal("system.ui.translate.nav.signup").setting_value}}</button>
  </form>
  <div class="form__component-error-message" v-if="signupError">
    {{signupError}}
  </div>
</template>

<script>
  import "../../styles/components/form.component.css";
  import {getTranslateByKey} from "../common/getTranslateByKey";

  export default {
    data() {
      return {
        signupForm: {
          username: "",
          name: "",
          email: "",
          password: ""
        },
        signupError: ""
      }
    },
    methods: {
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key);
      },
      async signup(e) {
        e.preventDefault();

        try {
          await this.axios.post("/signup", { ...this.signupForm });

          window.location.href = "/auth";
        } catch(e) {
          if(typeof e.response.data.message === "object") {
            this.signupError = getTranslateByKey(e.response.data.message[0]).setting_value;
          } else {
            this.signupError = getTranslateByKey(e.response.data.message).setting_value;
          }
        }
      }
    }
  }
</script>
