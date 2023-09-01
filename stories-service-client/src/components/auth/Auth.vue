<template>
  <form class="mt-200 form__component" @submit="auth">
    <input type="text" placeholder="Username or email:" v-model="authForm.usernameOrEmail">
    <input type="password" placeholder="Password:" v-model="authForm.password">
    <button type="submit">Auth</button>
  </form>
  <div class="form__component-error-message" v-if="authError">
    {{authError}}
  </div>
</template>

<script>
import "../../styles/components/form.component.css";

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

