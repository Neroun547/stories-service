<template>
  <div v-if="story">
    <h1 class="story-title">{{storyTitle}}</h1>
    <h3 class="story-theme">Theme: {{storyTheme}}</h3>
    <div v-html="story" class="wrapper__story"></div>
  </div>
  <div v-if="!story">
    <h2 class="not-found-logo">{{getTranslateByKeyLocal("system.ui.translate.story_not_found")}}</h2>
  </div>
</template>
<script>
  import {getTranslateByKey} from "../../common/getTranslateByKey";

  export default {
    data() {
      return {
        story: "",
        storyTitle: "",
        storyTheme: ""
      }
    },
    methods: {
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key).setting_value;
      },
    },
    async mounted() {
      this.story = (await this.axios.get("/stories/" + this.$route.params.hash)).data.story;

      const storyInfo = (await this.axios.get("/stories/get-story-info/" + this.$route.params.hash)).data;

      this.storyTitle = storyInfo.title;
      this.storyTheme = storyInfo.theme;
    }
  }
</script>
<style scoped>
  .wrapper__story {
    display: block;
    margin: 0 auto;
    width: 90%;
  }
  .story-title {
    text-align: center;
    margin-top: 50px;
  }
  .story-theme {
    text-align: center;
  }
  .not-found-logo {
    text-align: center;
  }
</style>
