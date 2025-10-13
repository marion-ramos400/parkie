import { createMemoryHistory, createRouter } from 'vue-router'
import Login from '@/components/Login/Login.vue'
import Dashboard from '@/components/Dashboard/Dashboard.vue'
import Home from '@/components/Home/Home.vue'
import Parking from '@/components/Parking/Parking.vue'
import Office from '@/components/Office/Office.vue'

const routes = [
  { 
    path: '/', 
    components: {
      MainContentView: Login
    } 
  },
  { 
    path: '/dashboard', 
    components: {
      MainContentView: Dashboard
    },
    children: [
      {
        path: 'home',
        components: {
          DashboardView: Home

        }
      },
      { 
        path: 'parking', 
        components: {
          DashboardView: Parking
        } 
      },
      { 
        path: 'office', 
        components: {
          DashboardView: Office
        } 
      }
    ]
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
