<template>
  <div class="wrapper__author-info">
    <img src="/profile.png" alt="Avatar" v-if="!user.avatar">
    <img :src="'/avatars/' + user.avatar" alt="Avatar" v-if="user.avatar">
    <div class="wrapper__author-info-contacts">
      <span>{{user.name}}</span>
      <span>{{user.username}}</span>
      <span>{{user.email}}</span>

      <button class="subscribe-btn" @click="addSubscribe" v-if="!alreadySubscribed && auth">{{getTranslateByKeyLocal("system.ui.translate.subscribe").setting_value}}</button>
      <span class="already-subscribed-span" v-if="alreadySubscribed && auth">{{getTranslateByKeyLocal("system.ui.translate.already_subscribed").setting_value}}</span>
      <button v-if="alreadySubscribed && auth" @click="removeSubscribe" class="remove-subscribe-btn">{{getTranslateByKeyLocal("system.ui.translate.unsubscribe").setting_value}}</button>
    </div>
  </div>
  <div class="wrapper__stories mt-50">
    <RouterLink v-for="item in stories" :to="'/stories/' + item.story_hash">
      <div class="wrapper__stories-item">
        <h1 class="wrapper__stories-item-title">{{item.title}}</h1>
        <h3 class="wrapper__stories-item-theme">{{item.theme}}</h3>

        <footer>
          <div class="wrapper__stories-item-author-date">
            <h4 class="wrapper__stories-item-author">{{getTranslateByKeyLocal("system.ui.translate.author").setting_value}}: {{item.author.username}}</h4>
            <span>{{item.created_at}}</span>
          </div>
          <button class="wrapper__stories-item-read-btn">{{getTranslateByKeyLocal("system.ui.translate.read").setting_value}}</button>
        </footer>
      </div>
    </RouterLink>
  </div>
  <button class="load-more-btn m0-auto mt-100 mb-100" v-if="lazyLoading.skip" @click="loadMore">{{getTranslateByKeyLocal('system.ui.translate.load_more').setting_value}}</button>
</template>
<script>
  import "../../../styles/components/load-more-btn.css";
  import "../../../styles/components/story.component.css";
  import { getTranslateByKey } from "../../common/getTranslateByKey.js";

  export default {
    data() {
      return {
        user: {},
        alreadySubscribed: false,
        auth: true,
        stories: [],
        lazyLoading: {
          count: 5,
          skip: 0
        }
      }
    },
    methods: {
      async loadMore() {
        const data = (await this.axios.get(`/stories/author-stories/${this.$route.params.id}/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

        this.stories.push(...data);

        if(data.length < this.lazyLoading.count) {
          this.lazyLoading.skip = 0;
        } else {
          this.lazyLoading.skip += 5;
        }
      },
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key);
      },
      async addSubscribe() {
        await this.axios.post("/users/subscribe/" + this.$route.params.id);

        this.alreadySubscribed = true
      },
      async removeSubscribe() {
        await this.axios.delete("/users/subscribe/" + this.$route.params.id);

        this.alreadySubscribed = false
      }
    },
    async mounted () {
      this.user = (await this.axios.get("/users/" + this.$route.params.id)).data;
      this.stories = (await this.axios.get(`/stories/author-stories/${this.$route.params.id}/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;
      let userSubscribe;

      try {
        userSubscribe = (await this.axios.get("/users/subscribe-user-by-author-id/" + this.$route.params.id)).data;
      } catch {
        this.auth = false;
      }
      this.alreadySubscribed = !!userSubscribe;
      if(this.stories.length < this.lazyLoading.count) {
        this.lazyLoading.skip = 0;
      } else {
        this.lazyLoading.skip = 5;
      }
    }
  }
</script>
<style scoped>
  .wrapper__author-info {
    max-width: 800px;
    width: 100%;
    display: flex;
    align-items: center;
    margin: 0 auto;
    margin-top: 50px;
  }
  .wrapper__author-info img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
  .wrapper__author-info-contacts {
    display: flex;
    flex-direction: column;
    margin-left: 100px;
  }
  .wrapper__author-info-contacts span {
    font-size: 20px;
    margin-top: 10px;
    font-weight: bold;
  }
  .subscribe-btn {
    border: none;
    border-radius: 5px;
    margin-top: 10px;
    padding: 5px;
    cursor: pointer;
    background-color: rgba(57,92,230,0.98);
    color: #fff;
  }
  .already-subscribed-span {
    background-color: #e5e5e5;
    padding: 5px;
    margin: 10px 0;
    border-radius: 5px;
  }
  .remove-subscribe-btn {
    border: none;
    border-radius: 5px;
    margin-top: 10px;
    padding: 5px;
    cursor: pointer;
    background-color: #9a0000;
    color: #fff;
  }
  @media screen and (max-width: 850px) {
    .wrapper__author-info {
      flex-direction: column;
    }
    .wrapper__author-info-contacts {
      margin-left: 0;
      margin-top: 50px;
    }
    .wrapper__author-info-contacts span {
      font-size: 16px;
    }
  }
  @media screen and (max-width: 525px) {
    .wrapper__author-info img {
      width: 150px;
      height: 150px;
    }
  }
</style>
