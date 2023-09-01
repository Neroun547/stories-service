<template>
  <div class="wrapper__stories-editor mt-50">
    <form @submit="saveStory">
      <input type="text" placeholder="Title:" v-model="title">
      <input type="text" placeholder="Theme:" v-model="theme">
      <Editor
          api-key="fqqboid3jj5dviefd7qko96da2nnz3run5y6af5t891srayh"
          :init="{
        plugins: 'lists link image table code help wordcount'
      }"
          v-model="story"
      />
      <button class="publish-story-btn" type="submit">Publish story</button>
    </form>
  </div>
</template>
<script setup>
  import Editor from '@tinymce/tinymce-vue'
</script>
<script>
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
      }
    }
  }
</script>
<style>
  .wrapper__stories-editor {
    width: 1000px;
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
    width: 800px;
    height: 50px;
    cursor: pointer;
  }
</style>
