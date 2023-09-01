<template>
  <h1 class="story-title">{{storyTitle}}</h1>
  <h3 class="story-theme">Theme: {{storyTheme}}</h3>
  <div v-html="story" class="wrapper__story"></div>
</template>
<script>
  export default {
    data() {
      return {
        story: "",
        storyTitle: "",
        storyTheme: ""
      }
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
    display: flex;
    margin: 0 auto;
    width: 80%;
  }
  .story-title {
    text-align: center;
    margin-top: 50px;
  }
  .story-theme {
    text-align: center;
  }
</style>
