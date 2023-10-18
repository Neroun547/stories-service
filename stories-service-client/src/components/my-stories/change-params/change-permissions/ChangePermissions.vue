<template>
  <div v-if="!publicStory">
    <button @click="changeStatusStory" class="make-story-public">{{getTranslateByKeyLocal("system.ui.translate.make_story_public")}}</button>
    <h2 class="change-permissions-logo">{{getTranslateByKeyLocal("system.ui.translate.my_stories.change_permissions_logo")}}</h2>
    <div class="wrapper__change-permissions">
      <div class="wrapper__change-permissions-item">
        <h3 class="mt-100">{{getTranslateByKeyLocal("system.ui.translate.chage_params.change_permissions.users_logo")}}:</h3>
        <div class="wrapper__change-permissions-item-users">
          <div class="wrapper__users">
            <div v-for="item in usersWhoHavePermissions" v-bind:key="item.id">
              <div class="wrapper__users-item">
                <img src="/profile.png" alt="Avatar" v-if="!item.avatar">
                <img :src="'/avatars/' + item.avatar" alt="Avatar" v-if="item.avatar">
                <span>{{item.username}}</span>
                <input type="checkbox" checked class="wrapper__users-item-checkbox" @click="(e) => checkboxPermissionForUser(e, item)">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="wrapper__change-permissions-item">
        <form @submit="submitSearchUserForm" class="search-user-form mt-100">
          <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.auth.username_or_email')" v-model="addPermissionsForm.username">
          <button>{{getTranslateByKeyLocal("system.ui.translate.search")}}</button>
        </form>
        <div class="wrapper__users">
          <div v-for="item in searchedUsers" v-bind:key="item.username">
            <div class="wrapper__users-item">
              <img src="/profile.png" alt="Avatar" v-if="!item.avatar">
              <img :src="'/avatars/' + item.avatar" alt="Avatar" v-if="item.avatar">
              <span>{{item.username}}</span>
              <input v-model="item.checked" type="checkbox" class="wrapper__users-item-checkbox" @click="(e) => checkboxPermissionForUser(e, item)">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="publicStory">
    <button class="make-story-private" @click="changeStatusStory">{{getTranslateByKeyLocal("system.ui.translate.make_story_private")}}</button>
  </div>
</template>
<script>
import "../../../../styles/components/search-users.component.css";
import {getTranslateByKey} from "../../../common/getTranslateByKey.js";

export default {
    data() {
      return {
        publicStory: null,
        addPermissionsForm: {
          username: ""
        },
        searchedUsers: [],
        usersWhoHavePermissions: [],
        lazyLoading: {
          count: 5,
          skip: 0
        },
        storyInfo: {

        }
      }
    },
    methods: {
      async submitSearchUserForm(e) {
        e.preventDefault();
        const data = (await this.axios.get(`/users/search-by-username-or-email/${this.addPermissionsForm.username}/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

        this.searchedUsers = data.map(searchedUser => {
          searchedUser.checked = !!this.usersWhoHavePermissions.find(permissionUser => permissionUser.id === searchedUser.id);

          return searchedUser;
        });
      },
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key).setting_value;
      },
      checkboxPermissionForUser(e, user) {
        if(e.target.checked) {
          this.usersWhoHavePermissions.push(user);
          this.searchedUsers = this.searchedUsers.filter(el => el.id !== user.id);
        } else {
          this.usersWhoHavePermissions = this.usersWhoHavePermissions.filter((el) => el.id !== user.id);
        }
        this.axios.patch("/stories/add-users-to-story-permissions/" + this.storyInfo.id, {
          users: this.usersWhoHavePermissions.map(el => el.id)
        });
      },
      changeStatusStory() {
        this.axios.patch("/stories/change-permission/" + this.storyInfo.id, {
          permission: !this.publicStory
        });

        this.publicStory = !this.publicStory;
        this.usersWhoHavePermissions = [];
      }
    },
    async mounted() {
      this.storyInfo = (await this.axios.get("/stories/get-story-info/" + this.$route.params.hash)).data;
      this.usersWhoHavePermissions = (await this.axios.get("/stories/permissions-users/" + this.storyInfo.id)).data;

      this.publicStory = this.storyInfo.permission === "public";
    }
}
</script>
<style scoped>
  .change-permissions-logo {
    text-align: center;
  }
  .wrapper__change-permissions {
    display: flex;
    justify-content: space-between;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
  }
  .wrapper__change-permissions-item {
    width: 40%;
  }
  .wrapper__users-item-checkbox {
    display: block;
    margin-left: auto;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .make-story-private {
    background-color: #9a0000;
    color: #fff;
    border: none;
    border-radius: 5px;
    display: block;
    margin: 0 auto;
    padding: 10px;
    cursor: pointer;
  }
  .make-story-public {
    background-color: #2bb206;
    color: #fff;
    border: none;
    border-radius: 5px;
    display: block;
    margin: 0 auto;
    padding: 10px;
    cursor: pointer;
  }
</style>
