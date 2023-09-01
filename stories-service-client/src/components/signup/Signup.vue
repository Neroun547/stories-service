<template>
  <form class="mt-200 form__component" @submit="signup">
    <input type="text" placeholder="Your name:" v-model="signupForm.name">
    <input type="text" placeholder="Your username:" v-model="signupForm.username">
    <input type="email" placeholder="Your email:" v-model="signupForm.email">
    <input type="password" placeholder="Password:" v-model="signupForm.password">
    <button type="submit">Sign up</button>
  </form>
  <div class="form__component-error-message" v-if="signupError">
    {{signupError}}
  </div>
</template>

<script>
  import "../../styles/components/form.component.css";

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
      async signup(e) {
        e.preventDefault();

        try {
          await this.axios.post("/signup", { ...this.signupForm });

          window.location.href = "/auth";
        } catch(e) {
          this.signupError = e.response.data.message;
        }
      }
    }
  }
</script>
