import { createRouter, createWebHistory } from 'vue-router'
import Main from "../components/main/Main.vue";
import Auth from "../components/auth/Auth.vue";
import Signup from "../components/signup/Signup.vue";
import ProfileSettings from "../components/profile-settings/ProfileSettings.vue";
import MyStories from "../components/my-stories/MyStories.vue";
import PublishStories from "../components/my-stories/publish-stories/PublishStories.vue";
import Story from "../components/stories/story/Story.vue";
import Authors from "../components/authors/Authors.vue";
import Author from "../components/authors/author/Author.vue";
import MySubscribes from "../components/my-subscribes/MySubscribes.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup
    },
    {
      path: "/profile-settings",
      name: "profile-settings",
      component: ProfileSettings
    },
    {
      path: "/my-stories",
      name: "my-stories",
      component: MyStories
    },
    {
      path: "/my-stories/publish-stories",
      name: "publish-stories",
      component: PublishStories
    },
    {
      path: "/stories/:hash",
      name: "read-story",
      component: Story
    },
    {
      path: "/authors",
      name: "authors",
      component: Authors
    },
    {
      path: "/authors/:id",
      name: "author",
      component: Author
    },
    {
      path: "/my-subscribes",
      name: "my-subscribes",
      component: MySubscribes
    }
  ]
})

export default router
