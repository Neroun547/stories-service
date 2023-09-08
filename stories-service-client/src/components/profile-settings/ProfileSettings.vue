<template>
  <h2 class="profile-settings-logo mt-100">{{getTranslateByKeyLocal("system.ui.translate.profile_settings").setting_value}}</h2>
  <div class="profile-settings-avatar">
    <img :src="'/avatars/' + userAvatar" alt="Avatar" v-if="userAvatar && !showPreselectedAvatar">
    <img src="/profile.png" alt="Avatar" v-if="!userAvatar && !showPreselectedAvatar">
    <div class="wrapper__preselected-avatar">

    </div>
    <input type="file" @change="changeAvatar">
  </div>
  <button class="m0-auto remove-current-avatar-btn" @click="deleteCurrentAvatar">{{getTranslateByKeyLocal("system.ui.translate.profile_settings.remove_current_avatar").setting_value}}</button>
  <form class="form__component mt-100" @submit="changeProfileSettings">
    <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.profile_settings.new_name').setting_value" v-model="user.name" required>
    <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.profile_settings.new_username').setting_value" v-model="user.username" required>
    <input type="email" :placeholder="getTranslateByKeyLocal('system.ui.translate.profile_settings.new_email').setting_value" v-model="user.email" required>

    <button @click="showChangePasswordInputs" type="button">{{getTranslateByKeyLocal('system.ui.translate.profile_settings.change_password').setting_value}}</button>

    <div class="change-password-inputs" v-if="showChangePasswordInputsState">
      <input type="password" :placeholder="getTranslateByKeyLocal('system.ui.translate.profile_settings.write_old_password').setting_value" v-model="user.oldPassword" required>
      <input type="password" :placeholder="getTranslateByKeyLocal('system.ui.translate.profile_settings.write_new_password').setting_value" v-model="user.newPassword" required>
    </div>

    <button type="submit">{{getTranslateByKeyLocal("system.ui.translate.save_changes").setting_value}}</button>
  </form>
  <div class="form__component-error-message" v-if="profileSettingsError">
    {{profileSettingsError}}
  </div>
</template>
<style scoped>
  .remove-current-avatar-btn {
    margin-top: 100px;
    padding: 5px;
    display: block;
    background-color: #9a0000;
    border: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
  }
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
  import { getTranslateByKey } from "../common/getTranslateByKey.js";

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
        showChangePasswordInputsState: false,
        showPreselectedAvatar: false
      }
    },
    async beforeMount() {
      try {
        const response = await this.axios.get("/auth/user-info");

        this.user.name = response.data.name;
        this.user.username = response.data.username;
        this.user.email = response.data.email;
        this.userAvatar = response.data.avatar;
      } catch(e) {

        if(e.response.status === 401) {
          window.location.href = "/auth";
        }
      }
    },
    methods: {
      async deleteCurrentAvatar() {
        const newToken = (await this.axios.delete("/users/avatar")).data.authToken;

        localStorage.setItem("authToken", newToken);

        window.location.reload();
      },
      changeAvatar(e) {
        this.showPreselectedAvatar = true;
        this.userAvatar = e.target.files[0];

        const avatar = URL.createObjectURL(this.userAvatar);
        const preselectedAvatar = document.querySelector(".preselected-avatar");

        if(preselectedAvatar) {
          preselectedAvatar.remove();
        }
        const img = document.createElement("img");

        img.classList.add("preselected-avatar");

        img.style.display = "block";
        img.style.width = "200px";
        img.style.height = "200px";
        img.style.margin = "0 auto";
        img.style.borderRadius = "50%";

        img.src = avatar;

        document.querySelector(".wrapper__preselected-avatar").appendChild(img);
      },
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key);
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

          if(this.user.oldPassword.trim() && this.user.newPassword.trim()) {
            formData.append("oldPassword", this.user.oldPassword);
            formData.append("newPassword", this.user.newPassword);
          }
          if(this.userAvatar) {
            formData.append("avatar", this.userAvatar);
          }
          const response = await this.axios.patch("/users", formData)

          localStorage.setItem("authToken", response.data.token);

          window.location.href = "/";
        } catch(e) {

          if(typeof e.response.data.message === "object") {
            this.profileSettingsError = getTranslateByKey(e.response.data.message[0]).setting_value;
          } else {
            this.profileSettingsError = getTranslateByKey(e.response.data.message).setting_value;
          }
        }
      }
    }
  }
</script>
