<template>
  <h2 class="profile-settings-logo mt-100">Profile settings</h2>
  <form class="form__component mt-100" @submit="changeProfileSettings">
    <input type="text" placeholder="New name:" v-model="user.name">
    <input type="text" placeholder="New username:" v-model="user.username">
    <input type="email" placeholder="New email:" v-model="user.email">

    <button @click="showChangePasswordInputs" type="button">Change password</button>

    <div class="change-password-inputs" v-if="showChangePasswordInputsState">
      <input type="password" placeholder="Write your old password" v-model="user.oldPassword">
      <input type="password" placeholder="Write your new password" v-model="user.newPassword">
    </div>

    <button type="submit">Save changes</button>
  </form>
  <div class="form__component-error-message" v-if="profileSettingsError">
    {{profileSettingsError}}
  </div>
</template>
<style scoped>
  .profile-settings-logo {
    text-align: center;
  }
  .change-password-inputs {
    display: flex;
    flex-direction: column;
  }
</style>
<script>
  export default {
    data() {
      return {
        profileSettingsError: "",
        user: {
          name: "",
          username: "",
          email: "",
          oldPassword: "",
          newPassword: ""
        },
        showChangePasswordInputsState: false
      }
    },
    async beforeMount() {
      const response = await this.axios.get("/auth/user-info");

      this.user.name = response.data.name;
      this.user.username = response.data.username;
      this.user.email = response.data.email;
    },
    methods: {
      showChangePasswordInputs() {
        this.showChangePasswordInputsState = !this.showChangePasswordInputsState;
      },
      async changeProfileSettings(e) {
        e.preventDefault();

        try {
          const response = await this.axios.patch("/users", {
            ...this.user
          });
          localStorage.setItem("authToken", response.data.token);

          window.location.href = "/";
        } catch(e) {
          this.profileSettingsError = e.response.data.message;
        }
      }
    }
  }
</script>
