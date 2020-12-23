import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Quiz from '../views/Quiz.vue'
import Rank from '../views/Rank.vue'
import About from '../views/About.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/quiz',
    component: Quiz,
  },
  {
    path: '/rank',
    component: Rank
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/profile',
    component: Profile
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
