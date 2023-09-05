<template>
  <div>
    <RouterLink to="/my-stories/publish-stories">
      <button class="publish-stories-button">
        <img src="../../../public/publish.png" alt="Publish stories">
      </button>
    </RouterLink>
  </div>
  <div v-if="!stories.length">
    <h2 class="no-stories-logo mt-50">{{getTranslateByKeyLocal("system.ui.translate.my_stories.no_stories_logo").setting_value}}</h2>
  </div>
  <div v-if="stories.length" class="wrapper__my-stories">
    <div v-for="story in stories" class="wrapper__my-stories-item">
      <h1 class="wrapper__my-stories-item-title">{{story.title}}</h1>
      <h3 class="wrapper__my-stories-item-theme">{{getTranslateByKeyLocal("system.ui.translate.theme").setting_value}}: {{story.theme}}</h3>
      <div class="wrapper__my-stories-item-footer">
        <div>
          <h5>{{story.created_at}}</h5>
        </div>
        <div class="wrapper__my-stories-item-footer-buttons">
          <button class="wrapper__my-stories-item-delete-btn" @click="deleteStoryByHash(story.story_hash)">{{getTranslateByKeyLocal("system.ui.translate.delete").setting_value}}</button>
          <RouterLink :to="'/stories/' + story.story_hash">
            <button class="wrapper__my-stories-item-read-btn">{{getTranslateByKeyLocal("system.ui.translate.read").setting_value}}</button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

  <button @click="loadMore" v-if="lazyLoading.skip" class="load-more-btn m0-auto mb-100">{{getTranslateByKeyLocal("system.ui.translate.load_more").setting_value}}</button>
</template>
<script>
import "../../styles/components/load-more-btn.css";
import {getTranslateByKey} from "../common/getTranslateByKey";

export default {
    data() {
      return {
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
      async deleteStoryByHash(hash) {
        await this.axios.delete("/stories/" + hash);

        this.stories = this.stories.filter(el => el.story_hash !== hash);
      },
      async loadMore() {
        const data = (await this.axios.get(`/stories/my-stories/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

        this.stories.push(...data);

        if(data.length === this.lazyLoading.count) {
          this.lazyLoading.skip += 5;
        } else {
          this.lazyLoading.skip = 0;
        }
      }
    },
    async mounted() {
      this.stories = (await this.axios.get(`/stories/my-stories/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

      if(this.stories.length === this.lazyLoading.count) {
        this.lazyLoading.skip += 5;
      } else {
        this.lazyLoading.skip = 0;
      }
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
  .wrapper__my-stories-item-footer {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
  }
  .wrapper__my-stories-item-footer-buttons {
    display: flex;
    max-width: 300px;
    justify-content: space-between;
    align-items: center;
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
