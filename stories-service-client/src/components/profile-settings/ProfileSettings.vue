<template>
  <h2 class="profile-settings-logo mt-100">Profile settings</h2>
  <div class="profile-settings-avatar">
    <img :src="'../../../public/avatars/' + userAvatar" alt="Avatar" v-if="userAvatar">
    <img src="../../../public/profile.png" alt="Avatar" v-if="!userAvatar">
    <input type="file" @change="changeAvatar">
  </div>
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
  .profile-settings-avatar img {
    display: block;
    width: 200px;
    height: 200px;
    margin: 0 auto;
    border-radius: 50%;
  }
  .profile-settings-avatar input {
    display: block;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
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
        userAvatar: null,
        showChangePasswordInputsState: false
      }
    },
    async beforeMount() {
      const response = await this.axios.get("/auth/user-info");

      this.user.name = response.data.name;
      this.user.username = response.data.username;
      this.user.email = response.data.email;
      this.userAvatar = response.data.avatar;
    },
    methods: {
      changeAvatar(e) {
        this.userAvatar = e.target.files[0]
      },
      showChangePasswordInputs() {
        this.showChangePasswordInputsState = !this.showChangePasswordInputsState;
      },
      async changeProfileSettings(e) {
        e.preventDefault();

        try {
          const formData = new FormData();

          formData.append("name", this.user.name);
          formData.append("username", this.user.username);
          formData.append("email", this.user.email);
          formData.append("oldPassword", this.user.oldPassword);
          formData.append("newPassword", this.user.newPassword);

          if(this.userAvatar) {
            formData.append("avatar", this.userAvatar);
          }
          const response = await this.axios.patch("/users", formData)

          localStorage.setItem("authToken", response.data.token);

          window.location.href = "/";
        } catch(e) {
          this.profileSettingsError = e.response.data.message;
        }
      }
    }
  }
</script>
