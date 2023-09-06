<template>
  <h1 class="stories-logo">{{getTranslateByKeyLocal("system.ui.translate.main_logo").setting_value}}</h1>
  <div class="wrapper__description">
    {{getTranslateByKeyLocal("system.ui.translate.main_logo_description").setting_value}}
  </div>
  <form @submit="searchStories" class="search-story-form">
    <input type="text" placeholder="Search stories by theme or title" v-model="themeOrTitle">
    <button>{{getTranslateByKeyLocal('system.ui.translate.search').setting_value}}</button>
  </form>
  <div class="wrapper__stories">
    <RouterLink v-for="item in stories" :to="'/stories/' + item.story_hash">
      <div class="wrapper__stories-item">
        <h1 class="wrapper__stories-item-title">{{item.title}}</h1>
        <h3 class="wrapper__stories-item-theme">{{item.theme}}</h3>

        <footer>
          <div class="wrapper__stories-item-author-date">
            <h4 class="wrapper__stories-item-author">
              <RouterLink :to="'/authors/' + item.author_id">{{getTranslateByKeyLocal("system.ui.translate.author").setting_value}}: {{item.author.username}}</RouterLink>
            </h4>
            <span>{{item.created_at}}</span>
          </div>
          <button class="wrapper__stories-item-read-btn">{{getTranslateByKeyLocal('system.ui.translate.read').setting_value}}</button>
        </footer>
      </div>
    </RouterLink>
  </div>
  <button class="load-more-btn m0-auto mt-100 mb-100" v-if="lazyLoading.skip" @click="loadMore">{{getTranslateByKeyLocal("system.ui.translate.load_more").setting_value}}</button>
</template>
<script>
  import { getTranslateByKey } from "../common/getTranslateByKey.js";
  import "../../styles/components/load-more-btn.css";
  import "../../styles/components/story.component.css";

  export default {
    data() {
      return {
        themeOrTitle: "",
        stories: [],
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
      async searchStories(e) {
        e.preventDefault();

        const data = (await this.axios.get("/stories/search-by-theme-or-title/" + this.themeOrTitle.replaceAll(" ", "") + `/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

        this.stories = data;

        this.lazyLoading.skip = 0;

        if(data.length < this.lazyLoading.count) {
          this.lazyLoading.skip = 0;
        } else {
          this.lazyLoading.skip += 5;
        }
      },
      async loadMore() {
        const data = (await this.axios.get(`/stories/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

        this.stories.push(...data);

        if(data.length < this.lazyLoading.count) {
          this.lazyLoading.skip = 0;
        } else {
          this.lazyLoading.skip += 5;
        }
      }
    },
    async mounted() {
      this.stories = (await this.axios.get(`/stories/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

      if(this.stories.length < this.lazyLoading.count) {
        this.lazyLoading.skip = 0;
      } else {
        this.lazyLoading.skip = 5;
      }
    }
  }
</script>
<style>
  a {
    text-decoration: none;
    color: #000;
  }
  .stories-logo {
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

  @media screen and (max-width: 520px) {
    .stories-logo {
      font-size: 20px;
    }
    .wrapper__description {
      font-size: 18px;
    }
    .search-story-form {
      font-size: 18px;
    }
    .search-story-form input {
      font-size: 14px;
    }
    .search-story-form button {
      font-size: 14px;
    }
  }
</style>
