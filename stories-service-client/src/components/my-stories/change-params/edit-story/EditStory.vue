<template>
  <div class="wrapper__stories-editor mt-50">
    <form @submit="saveStory">
      <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.title').setting_value + ':'" v-model="title" required>
      <input type="text" :placeholder="getTranslateByKeyLocal('system.ui.translate.theme').setting_value + ':'" v-model="theme" required>
      <Editor
          api-key="fqqboid3jj5dviefd7qko96da2nnz3run5y6af5t891srayh"
          :init="{
            plugins: 'lists link image table code help wordcount',
            language: 'uk',
            plugins: 'image code',
            toolbar: 'image undo redo | blocks | bold italic | alignleft aligncentre alignright alignjustify | indent outdent | bullist numlist',
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: getImageInEditor
        }"
          v-model="story"
      />
      <button class="publish-story-btn" type="submit">{{getTranslateByKeyLocal('system.ui.translate.save_changes').setting_value}}</button>
    </form>
  </div>
</template>
<script setup>
  import Editor from '@tinymce/tinymce-vue';
  import "../../../../styles/components/publish-story.component.css";
</script>
<script>
  import {getTranslateByKey} from "../../../common/getTranslateByKey";

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

        e.preventDefault();

        if(this.story.length) {
          await this.axios.patch("/stories/edit-story/" + this.$route.params.hash, {
            story: this.story,
            title: this.title,
            theme: this.theme
          });
          window.location.href = "/my-stories"
        }
      },
      getTranslateByKeyLocal(key) {
        return getTranslateByKey(key);
      },
      getImageInEditor(cb, value, meta) {
        const input =  document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.addEventListener('change', (e) => {
          const file = e.target.files[0];

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            /*
              Note: Now we need to register the blob in TinyMCEs image blob
              registry. In the next release this part hopefully won't be
              necessary, as we are looking to handle it internally.
            */
            const id = 'blobid' + (new Date()).getTime();
            const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
            const base64 = reader.result.split(',')[1];
            const blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);

            /* call the callback and populate the Title field with the file name */
            cb(blobInfo.blobUri(), { title: file.name });
          });
          reader.readAsDataURL(file);
        });

        input.click();
      }
    },
    async mounted() {
      this.story = (await this.axios.get("/stories/" + this.$route.params.hash)).data.story;

      const storyInfo = (await this.axios.get("/stories/get-story-info/" + this.$route.params.hash)).data;

      this.title = storyInfo.title;
      this.theme = storyInfo.theme;
    }
  }
</script>
