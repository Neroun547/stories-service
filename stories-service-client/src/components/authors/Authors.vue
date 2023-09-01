<template>
  <form class="search-user-form">
    <input type="text" placeholder="Username or email:" v-model="usernameOrEmail">
    <button>Search</button>
  </form>
</template>
<script>
  export default {
    data() {
      return {
        usernameOrEmail: ""
      }
    },
    methods: {
      async searchUsersByUsernameOrEmail(e) {
        e.preventDefault();
      }
    }
  }
</script>
<style scoped>
  .search-user-form {
    display: flex;
    justify-content: space-between;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    margin-top: 50px;
  }
  .search-user-form input {
    outline: none;
    width: 78%;
    border: none;
    border-bottom: 1px solid #000;
  }
  .search-user-form button {
    width: 20%;
    cursor: pointer;
    border: none;
    padding: 10px 0;
  }
</style>
