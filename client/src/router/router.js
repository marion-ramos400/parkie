import { createMemoryHistory, createRouter } from 'vue-router'
import Login from '@/components/Login/Login.vue'
import Dashboard from '@/components/Dashboard/Dashboard.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
