<template>
  <h2 class="subscribes-logo">{{getTranslateByKeyLocal("system.ui.translate.my_subscribes.logo").setting_value}}:</h2>
  <div class="wrapper__subscribes mt-50">
    <RouterLink v-for="item in authors" :to="'/authors/' + item.id">
      <div class="wrapper__users-item">
        <img src="/profile.png" alt="Avatar" v-if="!item.avatar">
        <img :src="'/avatars/' + item.avatar" alt="Avatar" v-if="item.avatar">
        <span>{{item.username}}</span>
      </div>
    </RouterLink>
  </div>
  <button class="load-more-btn m0-auto mt-100" v-if="lazyLoading.skip" @click="loadMore">{{getTranslateByKeyLocal("system.ui.translate.load_more").setting_value}}</button>
</template>
<script>
  import "../../styles/components/load-more-btn.css";
  import "../../styles/components/list-users.component.css";
  import { getTranslateByKey } from "../common/getTranslateByKey.js";

  export default {
    data() {
      return {
        authors: [],
        lazyLoading: {
          count: 5,
          skip: 0
        }
      }
    },
    methods: {
      async loadMore() {
        const data = (await this.axios.get(`/users/subscribes/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

        this.authors.push(...data);

        if(data.length < this.lazyLoading.count) {
          this.lazyLoading.skip = 0;
        } else {
          this.lazyLoading.skip += 5;
        }
      },
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key);
      }
    },
    async mounted() {
      try {
        this.authors = (await this.axios.get(`/users/subscribes/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

        if (this.authors.length < this.lazyLoading.count) {
          this.lazyLoading.skip = 0;
        } else {
          this.lazyLoading.skip = 5;
        }
      } catch(e) {
        if(e.response.status === 401) {
          window.location.href = "/auth";
        }
      }
    }
  }
</script>
<style>
  .subscribes-logo {
    text-align: center;
  }
  .wrapper__subscribes {
    max-width: 1000px;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
</style>
