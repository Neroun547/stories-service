<template>
  <form class="search-user-form" @submit="searchUsersByUsernameOrEmail">
    <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.auth.username_or_email').setting_value" v-model="usernameOrEmail">
    <button>{{getTranslateByKeyLocal('system.ui.translate.search').setting_value}}</button>
  </form>

  <div class="wrapper__users">
    <RouterLink v-for="item in users" :to="'/authors/' + item.id">
      <div class="wrapper__users-item">
        <img src="/profile.png" alt="Avatar" v-if="!item.avatar">
        <img :src="'/avatars/' + item.avatar" alt="Avatar" v-if="item.avatar">
        <span>{{item.username}}</span>
      </div>
    </RouterLink>
  </div>

  <button class="load-more-btn m0-auto mt-100 mb-100" v-if="lazyLoading.skip" @click="loadMore">{{getTranslateByKeyLocal('system.ui.translate.load_more').setting_value}}</button>
</template>
<script>
  import "../../styles/components/load-more-btn.css";
  import "../../styles/components/list-users.component.css";
  import { getTranslateByKey } from "../common/getTranslateByKey.js";

  export default {
    data() {
      return {
        usernameOrEmail: "",
        users: [],
        lazyLoading: {
          count: 5,
          skip: 0
        }
      }
    },
    methods: {
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key);
      },
      async searchUsersByUsernameOrEmail(e) {
        e.preventDefault();

        const data = (await this.axios.get(`/users/search-by-username-or-email/${this.usernameOrEmail}/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

        this.users = data;

        if(data.length < this.lazyLoading.count) {
          this.lazyLoading.skip = 0;
        } else {
          this.lazyLoading.skip += 5;
        }
      },
      async loadMore() {
        const data = (await this.axios.get(`/users/search-by-username-or-email/${this.usernameOrEmail}/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

        this.users.push(...data);

        if(data.length < this.lazyLoading.count) {
          this.lazyLoading.skip = 0;
        } else {
          this.lazyLoading.skip += 5;
        }
      }
    }
  }
</script>
<style scoped>
  .search-user-form {
    display: flex;
    justify-content: space-between;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    margin-top: 50px;
  }
  .search-user-form input {
    outline: none;
    width: 78%;
    border: none;
    border-bottom: 1px solid #000;
  }
  .search-user-form button {
    width: 20%;
    cursor: pointer;
    border: none;
    padding: 10px 0;
  }
  @media screen and (max-width: 520px) {
    .search-user-form button {
      font-size: 14px;
    }
    .search-user-form input {
      font-size: 14px;
    }
  }
</style>
