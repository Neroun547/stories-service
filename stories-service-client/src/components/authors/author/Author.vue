<template>
  <h2>Author</h2>
  <h3>{{user.username}}</h3>
</template>
<script>
  export default {
    data() {
      return {
        user: {}
      }
    },
    methods: {

    },
    async mounted () {
      this.user = (await this.axios.get("/users/" + this.$route.params.id)).data
    }
  }
</script>
