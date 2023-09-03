<template>
  <div class="wrapper__subscribes mt-50">
    <RouterLink v-for="item in authors" :to="'/authors/' + item.id">
      <div class="wrapper__users-item">
        <img src="/profile.png" alt="Avatar" v-if="!item.avatar">
        <img :src="'/avatars/' + item.avatar" alt="Avatar" v-if="item.avatar">
        <span>{{item.username}}</span>
      </div>
    </RouterLink>
  </div>
</template>
<script>
  import "../../styles/components/list-users.component.css";

  export default {
    data() {
      return {
        authors: []
      }
    },
    async mounted() {
      this.authors = (await this.axios.get("/users/subscribes/")).data;
    }
  }
</script>
<style>
  .wrapper__subscribes {
    max-width: 1000px;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
</style>
