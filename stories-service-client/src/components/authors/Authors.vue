<template>
  <form class="search-user-form" @submit="searchUsersByUsernameOrEmail">
    <input type="text" placeholder="Username or email:" v-model="usernameOrEmail">
    <button>Search</button>
  </form>

  <div class="wrapper__users">
    <RouterLink v-for="item in users" :to="'/authors/' + item.id">
      <div class="wrapper__users-item">
        <img src="../../../public/profile.png" alt="Avatar" v-if="!item.avatar">
        <img :src="'../../../public/avatars/' + item.avatar" alt="Avatar" v-if="item.avatar">
        <span>{{item.username}}</span>
      </div>
    </RouterLink>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        usernameOrEmail: "",
        users: []
      }
    },
    methods: {
      async searchUsersByUsernameOrEmail(e) {
        e.preventDefault();

        this.users = (await this.axios.get("/users/search-by-username-or-email/" + this.usernameOrEmail + "/?count=10&skip=0")).data
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
  .wrapper__users {
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    margin-top: 100px;
  }
  .wrapper__users-item {
    display: flex;
    align-items: center;
    background-color: #e5e5e5;
    padding: 5px;
    border-radius: 5px;
    margin-top: 30px;
  }
  .wrapper__users-item:hover {
    background-color: rgba(210, 210, 210, 0.98);
  }
  .wrapper__users-item span {
    margin-left: 10px;
  }
  .wrapper__users-item img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
</style>
