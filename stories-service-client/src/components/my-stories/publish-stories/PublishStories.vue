<template>
  <div class="wrapper__stories-editor mt-50">
    <form @submit="saveStory">
      <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.title').setting_value + ':'" v-model="title">
      <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.theme').setting_value + ':'" v-model="theme">
      <Editor
          api-key="fqqboid3jj5dviefd7qko96da2nnz3run5y6af5t891srayh"
          :init="{
        plugins: 'lists link image table code help wordcount'
      }"
          v-model="story"
      />
      <button class="publish-story-btn" type="submit">{{getTranslateByKeyLocal('system.ui.translate.publish_story').setting_value}}</button>
    </form>
  </div>
</template>
<script setup>
  import Editor from '@tinymce/tinymce-vue'
</script>
<script>
  import { getTranslateByKey } from "../../common/getTranslateByKey.js";

  export default {
    data() {
      return {
        story: "",
        title: "",
        theme: ""
      }
    },
    methods: {
      async saveStory(e) {
        e.preventDefault();

        await this.axios.post("/stories/", {
          story: this.story,
          title: this.title,
          theme: this.theme
        });

        window.location.href = "/my-stories"
      },
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key);
      }
    },
    async mounted() {
      try {
        await this.axios.get("/auth/user-info");
      } catch(e) {

        if(e.response.status === 401) {
          window.location.href = "/auth";
        }
      }
    }
  }
</script>
<style>
  .wrapper__stories-editor {
    max-width: 1000px;
    display: block;
    margin: 0 auto;
  }
  .wrapper__stories-editor form {
    display: flex;
    flex-direction: column;
  }
  .wrapper__stories-editor form input {
    border: none;
    border-bottom: 1px solid #000;
    outline: none;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .wrapper__stories-editor textarea {
    height: 800px;
  }
  .publish-story-btn {
    display: block;
    margin: 0 auto;
    margin-top: 20px;
    border: none;
    border-radius: 5px;
    max-width: 800px;
    width: 100%;
    height: 50px;
    cursor: pointer;
  }
</style>
