import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Dashboard from '../views/Dashboard.vue'
import EmployeeList from '../views/EmployeeList.vue'
import EmployeeDetail from '../views/EmployeeDetail.vue'
import EmployeeForm from '../views/EmployeeForm.vue'
import CompanySettings from '../views/CompanySettings.vue'
import AllEmployees from '../views/AllEmployees.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/employees/:company',
    name: 'employees',
    component: EmployeeList,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/employees/:company/:id',
    name: 'employee-detail',
    component: EmployeeDetail,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/employees/:company/new',
    name: 'new-employee',
    component: EmployeeForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/employees/:company/:id/edit',
    name: 'edit-employee',
    component: EmployeeForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/all-employees',
    name: 'all-employees',
    component: AllEmployees,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/:company',
    name: 'company-settings',
    component: CompanySettings,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.checkAuth()) {
    next('/login')
  } else if (to.name === 'login' && userStore.checkAuth()) {
    next('/')
  } else {
    next()
  }
})

export default router