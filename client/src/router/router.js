import { createMemoryHistory, createRouter } from 'vue-router'
import { apiLogOutUser } from '@/api/api.users.js'
import Login from '@/components/Login/Login.vue'
import Dashboard from '@/components/Dashboard/Dashboard.vue'
import Home from '@/components/Home/Home.vue'
import Parking from '@/components/Parking/Parking.vue'
import ParkingAdmin from '@/components/Parking/ParkingAdmin.vue'
import ParkingSetSlots from '@/components/Parking/ParkingSetSlots.vue'
import Office from '@/components/Office/Office.vue'

const routes = [
  { 
    path: '/', 
    name: 'login',
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
        name: 'home',
        components: {
          DashboardView: Home

        }
      },
      { 
        path: 'parking', 
        name: 'parking', 
        components: {
          DashboardView: Parking
        } 
      },
      { 
        path: 'office', 
        name: 'office', 
        components: {
          DashboardView: Office
        } 
      },
      {
        path: 'parkingadmin',
        name: 'parkingadmin',
        components: {
          DashboardView: ParkingSetSlots//ParkingAdmin
        }
      },
      {
        path: 'setslots/:fpname/:floor/:bldg',
        name: 'setslots',
        props: true,
        components: {
          DashboardView: ParkingSetSlots
        }
      }
    ]
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach( async (to, from) => {
  const fromNames = routes[1]
    .children.map(item=>item.name)
  if (to.name === "login"
    && fromNames.includes(from.name)
  ) {
    await apiLogOutUser() 
  }
})

export default router
