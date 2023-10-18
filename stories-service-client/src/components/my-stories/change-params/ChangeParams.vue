<template>
  <div class="wrapper__main">
    <RouterLink :to="'/my-stories/change-params/edit-story/' + this.$route.params.hash">
      <button>{{getTranslateByKeyLocal("system.ui.translate.change_params_story.edit_story")}}</button>
    </RouterLink>
    <RouterLink :to="'/my-stories/change-params/change-permissions/' + this.$route.params.hash" >
      <button>{{getTranslateByKeyLocal("system.ui.translate.change_params_story.change_permissions")}}</button>
    </RouterLink>
  </div>
</template>
<script>
 import { getTranslateByKey } from "../../common/getTranslateByKey.js";

 export default {
   data() {

   },
   methods: {
     getTranslateByKeyLocal(key) {
       return getTranslateByKey(key).setting_value;
     }
   }
 }
</script>
<style scoped>
  .wrapper__main {
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
  }
  .wrapper__main button {
    margin-top: 60px;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 100%;
    font-size: 18px;
    cursor: pointer;
  }
</style>
