<template>
  <h1 class="horror-stories-logo">Stories service</h1>
  <div class="wrapper__description">
    It's service for stories ... You can read stories, publish stories
  </div>
  <form @submit="searchStories" class="search-story-form">
    <input type="text" placeholder="Search stories by theme or title" v-model="themeOrTitle">
    <button>Search</button>
  </form>
  <div class="wrapper__stories">
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
  import "../../styles/components/story.component.css";

  export default {
    data() {
      return {
        themeOrTitle: "",
        stories: []
      }
    },
    methods: {
      async searchStories(e) {
        e.preventDefault();

        this.stories = (await this.axios.get("/stories/search-by-theme-or-title/" + this.themeOrTitle.replaceAll(" ", "") + "/?count=5&skip=0")).data;
      }
    },
    async mounted() {
      this.stories = (await this.axios.get("/stories/?count=10&skip=0")).data;
    }
  }
</script>
<style>
  a {
    text-decoration: none;
    color: #000;
  }
  .horror-stories-logo {
    text-align: center;
    margin-top: 100px;
  }
  .wrapper__description {
    display: block;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    font-size: 20px;
  }
  .search-story-form {
    display: flex;
    justify-content: space-between;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    margin-top: 110px;
    font-size: 20px;
  }
  .search-story-form input {
    border: none;
    border-bottom: 1px solid #000;
    outline: none;
    width: 78%;
  }
  .search-story-form button {
    width: 20%;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    padding: 5px 0;
  }
</style>
