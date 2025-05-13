<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '../../stores/employee'
import { useUserStore } from '../../stores/user'

const route = useRoute()
const router = useRouter()
const employeeStore = useEmployeeStore()
const userStore = useUserStore()
const searchQuery = ref('')

const currentCompany = computed(() => {
  return route.params.company || 'nsh'
})

const companyDisplayName = computed(() => {
  const companies = {
    nsh: 'NSH Corporation',
    tsn: 'TSN Enterprises',
    oth: 'OTH Industries'
  }
  return companies[currentCompany.value] || 'Dashboard'
})

const pageTitle = computed(() => {
  if (route.name === 'dashboard') return 'Dashboard'
  if (route.name === 'employees') return `${companyDisplayName.value} Employees`
  if (route.name === 'employee-detail') return 'Employee Details'
  if (route.name === 'new-employee') return 'Add New Employee'
  if (route.name === 'edit-employee') return 'Edit Employee'
  if (route.name === 'company-settings') return `${companyDisplayName.value} Settings`
  return 'Employee Management System'
})

const currentUserName = computed(() => {
  return userStore.currentUser?.fullName || 'Usuario'
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    employeeStore.setSearchQuery(searchQuery.value)
    if (route.name !== 'employees') {
      router.push(`/employees/${currentCompany.value}`)
    }
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  employeeStore.setSearchQuery('')
}

const addNewEmployee = () => {
  router.push(`/employees/${currentCompany.value}/new`)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="header-title">
      <h1>{{ pageTitle }}</h1>
    </div>
    
    <div class="header-actions">
      <div class="search-bar">
        <input 
          type="text"
          v-model="searchQuery"
          placeholder="Search employees..."
          @keyup.enter="handleSearch"
        >
        <button v-if="searchQuery" class="clear-btn" @click="clearSearch">✕</button>
        <button class="search-btn" @click="handleSearch">
          Search
        </button>
      </div>
      
      <button v-if="route.name === 'employees'" class="add-btn" @click="addNewEmployee">
        Add Employee
      </button>
      
      <div class="user-menu">
        <span class="user-name">{{ currentUserName }}</span>
        <button class="logout-btn" @click="handleLogout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  padding: 1.5rem;
  background-color: var(--color-card);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-bar {
  position: relative;
  width: 300px;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

.clear-btn {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.875rem;
}

.search-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-primary);
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-btn:hover {
  background-color: #0069d9;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1rem;
  border-left: 1px solid var(--color-border);
}

.user-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.logout-btn {
  background-color: transparent;
  color: var(--color-error);
  border: 1px solid var(--color-error);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: var(--color-error);
  color: white;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .user-menu {
    width: 100%;
    padding: 1rem 0 0 0;
    border-left: none;
    border-top: 1px solid var(--color-border);
    justify-content: space-between;
  }
}
</style>