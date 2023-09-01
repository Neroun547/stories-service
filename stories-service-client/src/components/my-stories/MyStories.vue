<template>
  <div>
    <RouterLink to="/my-stories/publish-stories">
      <button class="publish-stories-button">
        <img src="../../../public/publish.png" alt="Publish stories">
      </button>
    </RouterLink>
  </div>
  <div v-if="!stories.length">
    <h2 class="no-stories-logo mt-50">You don't have stories ...</h2>
  </div>
  <div v-if="stories.length" class="wrapper__my-stories">
    <div v-for="story in stories" class="wrapper__my-stories-item">
      <h1 class="wrapper__my-stories-item-title">{{story.title}}</h1>
      <h3 class="wrapper__my-stories-item-theme">Theme: {{story.theme}}</h3>
      <div class="wrapper__my-stories-item-buttons">
        <button class="wrapper__my-stories-item-delete-btn" @click="deleteStoryByHash(story.story_hash)">Delete</button>
        <RouterLink :to="'/stories/' + story.story_hash">
          <button class="wrapper__my-stories-item-read-btn">Read</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        stories: []
      }
    },
    methods: {
      async deleteStoryByHash(hash) {
        await this.axios.delete("/stories/" + hash);

        this.stories = this.stories.filter(el => el.story_hash !== hash);
      }
    },
    async mounted() {
      this.stories = (await this.axios.get("/stories/my-stories")).data;
    }
  }
</script>
<style>
  .no-stories-logo {
    text-align: center;
  }
  .publish-stories-button {
    width: 120px;
    height: 120px;
    border: none;
    border-radius: 50%;
    display: block;
    margin: 0 auto;
    margin-top: 50px;
    cursor: pointer;
  }
  .publish-stories-button img {
    width: 80px;
    height: 80px;
  }
  .wrapper__my-stories {
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
  }
  .wrapper__my-stories-item {
    background-color: #e5e5e5;
    width: 100%;
    border-radius: 5px;
    margin-top: 50px;
    margin-bottom: 30px;
    padding: 10px;
  }
  .wrapper__my-stories-item-title {
    text-align: center;
  }
  .wrapper__my-stories-item-theme {
    text-align: center;
  }
  .wrapper__my-stories-item-buttons {
    margin-top: 40px;
    display: flex;
    justify-content: end;
  }
  .wrapper__my-stories-item-read-btn {
    display: block;
    border: none;
    cursor: pointer;
    font-size: 20px;
    background-color: #000;
    color: #fff;
    border-radius: 5px;
    padding: 5px 10px;
  }
  .wrapper__my-stories-item-delete-btn {
    display: block;
    border: none;
    cursor: pointer;
    font-size: 20px;
    background-color: #9a0000;
    color: #fff;
    border-radius: 5px;
    padding: 5px 10px;
    margin-right: 10px;
  }
</style>
