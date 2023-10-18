<template>
  <div>
    <RouterLink to="/my-stories/publish-stories">
      <button class="publish-stories-button">
        <img src="/publish.png" alt="Publish stories">
      </button>
    </RouterLink>
  </div>
  <div v-if="!stories.length">
    <h2 class="no-stories-logo mt-50">{{getTranslateByKeyLocal("system.ui.translate.my_stories.no_stories_logo").setting_value}}</h2>
  </div>
  <div v-if="stories.length" class="wrapper__my-stories">
    <div class="wrapper__order-by">
      <h2>{{getTranslateByKeyLocal("system.ui.translate.my_stories.sort").setting_value}}</h2>
      <select v-model="orderByState" @change="orderBy">
        <option value="start_new">{{getTranslateByKeyLocal("system.ui.translate.my_stories.start_from_new").setting_value}}</option>
        <option value="start_old">{{getTranslateByKeyLocal("system.ui.translate.my_stories.start_from_old").setting_value}}</option>
      </select>
    </div>
    <div v-for="story in stories" class="wrapper__my-stories-item">
      <RouterLink :to="'/my-stories/change-params/' + story.story_hash">
        <button class="wrapper__my-stories-item-settings-btn">
          <img src="/settings.png" alt="Settings">
        </button>
      </RouterLink>
      <h1 class="wrapper__my-stories-item-title">{{story.title}}</h1>
      <h3 class="wrapper__my-stories-item-theme">{{getTranslateByKeyLocal("system.ui.translate.theme").setting_value}}: {{story.theme}}</h3>
      <footer class="wrapper__my-stories-item-footer">
        <div>
          <div>
            <span class="color-red" v-if="story.permission === 'private'"><p><span class="color-black">Status:</span> {{story.permission}}</p></span>
            <span class="color-green" v-if="story.permission === 'public'"><p><span class="color-black">Status:</span> {{story.permission}}</p></span>
          </div>
          <h5>{{story.created_at}}</h5>
        </div>
        <div class="wrapper__my-stories-item-footer-buttons">
          <button class="wrapper__my-stories-item-delete-btn" @click="deleteStoryByHash(story.story_hash)">{{getTranslateByKeyLocal("system.ui.translate.delete").setting_value}}</button>
          <RouterLink :to="'/stories/' + story.story_hash">
            <button class="wrapper__my-stories-item-read-btn">{{getTranslateByKeyLocal("system.ui.translate.read").setting_value}}</button>
          </RouterLink>
        </div>
      </footer>
    </div>
  </div>

  <button @click="loadMore" v-if="lazyLoading.skip > 0" class="load-more-btn m0-auto mb-100">{{getTranslateByKeyLocal("system.ui.translate.load_more").setting_value}}</button>
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
        },
        orderByState: "start_new"
      }
    },
    methods: {
      async orderBy() {
        this.stories = (await this.axios.get(`/stories/my-stories/?count=5&skip=0&orderBy=${this.orderByState}`)).data;

        if(this.stories.length === 5) {
          this.lazyLoading.skip = 5;
        } else {
          this.lazyLoading.skip = 0;
        }
      },
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key);
      },
      async deleteStoryByHash(hash) {
        this.lazyLoading.skip -= 1;
        await this.axios.delete("/stories/" + hash);

        this.stories = this.stories.filter(el => el.story_hash !== hash);
      },
      async loadMore() {
        const data = (await this.axios.get(`/stories/my-stories/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}&orderBy=${this.orderByState}`)).data;

        this.stories.push(...data);

        if(data.length === this.lazyLoading.count) {
          this.lazyLoading.skip += 5;
        } else {
          this.lazyLoading.skip = 0;
        }
      }
    },
    async mounted() {
      try {
        this.stories = (await this.axios.get(`/stories/my-stories/?count=${this.lazyLoading.count}&skip=${this.lazyLoading.skip}`)).data;

        if (this.stories.length === this.lazyLoading.count) {
          this.lazyLoading.skip += 5;
        } else {
          this.lazyLoading.skip = 0;
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
    width: auto;
    border-radius: 5px;
    margin-top: 50px;
    margin-bottom: 30px;
    padding: 10px;
  }
  .wrapper__my-stories-item-settings-btn {
    background-color: transparent;
    border: none;
    display: block;
    margin-left: auto;
    cursor: pointer;
  }
  .wrapper__my-stories-item-settings-btn img {
    width: 30px;
    height: 30px;
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

  @media screen and (max-width: 865px) {
    .wrapper__my-stories {
      width: auto;
    }
    .wrapper__my-stories-item-title {
      font-size: 20px;
    }
    .wrapper__my-stories-item-theme {
      font-size: 18px;
    }
    .wrapper__my-stories-item-delete-btn {
      font-size: 16px;
    }
    .wrapper__my-stories-item-read-btn {
      font-size: 16px;
    }
    .publish-stories-button {
      width: 100px;
      height: 100px;
    }
    .publish-stories-button img {
      width: 60px;
      height: 60px;
    }
  }

  @media screen and (max-width: 520px) {
    .publish-stories-button {
      width: 80px;
      height: 80px;
    }
    .publish-stories-button img {
      width: 50px;
      height: 50px;
    }
  }
</style>
