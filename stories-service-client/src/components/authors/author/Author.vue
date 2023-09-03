<template>
  <div class="wrapper__author-info">
    <img src="/profile.png" alt="Avatar" v-if="!user.avatar">
    <img :src="'/avatars/' + user.avatar" alt="Avatar" v-if="user.avatar">
    <div class="wrapper__author-info-contacts">
      <span>{{user.name}}</span>
      <span>{{user.username}}</span>
      <span>{{user.email}}</span>

      <button class="subscribe-btn" @click="addSubscribe" v-if="!alreadySubscribed">Subscribe</button>
      <span class="already-subscribed-span" v-if="alreadySubscribed">Already subscribed</span>
      <button v-if="alreadySubscribed" @click="removeSubscribe" class="remove-subscribe-btn">Unsubscribe</button>
    </div>
  </div>
  <div class="wrapper__stories mt-50">
    <RouterLink v-for="item in stories" :to="'/stories/' + item.story_hash">
      <div class="wrapper__stories-item">
        <h1 class="wrapper__stories-item-title">{{item.title}}</h1>
        <h3 class="wrapper__stories-item-theme">{{item.theme}}</h3>

        <footer>
          <div class="wrapper__stories-item-author-date">
            <h4 class="wrapper__stories-item-author">Author: {{item.author.username}}</h4>
            <span>{{item.created_at}}</span>
          </div>
          <button class="wrapper__stories-item-read-btn">Read</button>
        </footer>
      </div>
    </RouterLink>
  </div>
</template>
<script>
  import "../../../styles/components/story.component.css";

  export default {
    data() {
      return {
        user: {},
        alreadySubscribed: false,
        stories: []
      }
    },
    methods: {
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
      this.stories = (await this.axios.get("/stories/author-stories/" + this.$route.params.id + "/?count=10&skip=0")).data
      const userSubscribe = (await this.axios.get("/users/subscribe-user-by-author-id/" + this.$route.params.id)).data;

      if(userSubscribe) {
        this.alreadySubscribed = true;
      } else {
        this.alreadySubscribed = false;
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
</style>
