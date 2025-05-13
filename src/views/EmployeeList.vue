<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '../stores/employee'
import EmployeeCard from '../components/employee/EmployeeCard.vue'

const props = defineProps({
  company: {
    type: String,
    required: true
  }
})

const router = useRouter()
const employeeStore = useEmployeeStore()

const employees = ref([])
const isLoading = ref(true)
const statusFilter = ref('all')
const sortOption = ref('name')
const searchText = ref('')

// Get employees when component mounts or company changes
watch(() => props.company, fetchEmployees, { immediate: true })

async function fetchEmployees() {
  isLoading.value = true
  try {
    employees.value = await employeeStore.getEmployees(props.company)
    
    // Set search query from store if available
    const storeSearchQuery = employeeStore.getSearchQuery()
    if (storeSearchQuery) {
      searchText.value = storeSearchQuery
    }
  } catch (error) {
    console.error('Error fetching employees:', error)
  } finally {
    isLoading.value = false
  }
}

// Filtered employees based on status and search
const filteredEmployees = computed(() => {
  let result = employees.value

  // Filter by status
  if (statusFilter.value !== 'all') {
    const isActive = statusFilter.value === 'active'
    result = result.filter(emp => emp.isActive === isActive)
  }

  // Filter by search text
  if (searchText.value.trim()) {
    const searchLower = searchText.value.toLowerCase()
    result = result.filter(emp => 
      emp.firstName.toLowerCase().includes(searchLower) ||
      emp.lastName.toLowerCase().includes(searchLower) ||
      emp.employeeId.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower)
    )
  }

  // Sort the results
  return sortEmployees(result)
})

// Sort employees based on selected option
function sortEmployees(emps) {
  switch (sortOption.value) {
    case 'name':
      return [...emps].sort((a, b) => 
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      )
    case 'id':
      return [...emps].sort((a, b) => a.employeeId.localeCompare(b.employeeId))
    case 'hireDate':
      return [...emps].sort((a, b) => new Date(b.hireDate || 0) - new Date(a.hireDate || 0))
    default:
      return emps
  }
}

// Add new employee
const addEmployee = () => {
  router.push(`/employees/${props.company}/new`)
}

// Update filters
const updateStatusFilter = (status) => {
  statusFilter.value = status
}

const updateSortOption = (option) => {
  sortOption.value = option
}

const handleSearch = () => {
  employeeStore.setSearchQuery(searchText.value)
}

const clearSearch = () => {
  searchText.value = ''
  employeeStore.setSearchQuery('')
}

const companyName = computed(() => {
  const companies = {
    nsh: 'NSH Corporation',
    tsn: 'TSN Enterprises',
    oth: 'OTH Industries'
  }
  return companies[props.company] || props.company.toUpperCase()
})

const companyColor = computed(() => {
  const colors = {
    nsh: 'var(--color-nsh)',
    tsn: 'var(--color-tsn)',
    oth: 'var(--color-oth)'
  }
  return colors[props.company] || 'var(--color-primary)'
})
</script>

<template>
  <div class="employee-list fade-in">
    <div class="list-header" :style="{ '--company-color': companyColor }">
      <h2>{{ companyName }} Employees</h2>
      
      <div class="filters-bar">
        <div class="status-filter">
          <button 
            :class="{ active: statusFilter === 'all' }" 
            @click="updateStatusFilter('all')"
          >
            All
          </button>
          <button 
            :class="{ active: statusFilter === 'active' }" 
            @click="updateStatusFilter('active')"
          >
            Active
          </button>
          <button 
            :class="{ active: statusFilter === 'inactive' }" 
            @click="updateStatusFilter('inactive')"
          >
            Inactive
          </button>
        </div>
        
        <div class="sort-filter">
          <label for="sort">Sort by:</label>
          <select id="sort" v-model="sortOption" @change="updateSortOption(sortOption)">
            <option value="name">Name</option>
            <option value="id">ID</option>
            <option value="hireDate">Hire Date</option>
          </select>
        </div>
        
        <div class="search-filter">
          <input 
            type="text" 
            v-model="searchText" 
            placeholder="Search employees..." 
            @keyup.enter="handleSearch"
          >
          <button v-if="searchText" class="clear-btn" @click="clearSearch">✕</button>
          <button class="search-btn" @click="handleSearch">Search</button>
        </div>
      </div>
      
      <button class="add-btn" @click="addEmployee">
        Add Employee
      </button>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <p>Loading employees...</p>
    </div>
    
    <div v-else-if="filteredEmployees.length === 0" class="empty-state">
      <p>No employees found. {{ searchText ? 'Try adjusting your search or filters.' : 'Add an employee to get started.' }}</p>
      <button class="btn-primary" @click="addEmployee">Add Employee</button>
    </div>
    
    <div v-else class="employees-grid grid">
      <EmployeeCard
        v-for="employee in filteredEmployees"
        :key="employee.id"
        :employee="employee"
        :company="company"
      />
    </div>
  </div>
</template>

<style scoped>
.employee-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.list-header {
  background: linear-gradient(135deg, var(--company-color), color-mix(in srgb, var(--company-color) 70%, white));
  padding: 2rem;
  border-radius: 12px;
  color: white;
}

.list-header h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-filter {
  display: flex;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.status-filter button {
  background: none;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.status-filter button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.status-filter button.active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: 500;
}

.sort-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
}

.sort-filter select {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
}

.search-filter {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-filter input {
  width: 100%;
  padding: 0.6rem;
  padding-right: 5rem;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.search-filter input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-filter .clear-btn {
  position: absolute;
  right: 4rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
}

.search-filter .search-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 1rem;
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
}

.add-btn {
  background-color: white;
  color: var(--company-color);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.add-btn:hover {
  opacity: 0.9;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background-color: var(--color-card);
  border-radius: 12px;
  gap: 1.5rem;
}

.empty-state p,
.loading-state p {
  color: var(--color-text-secondary);
  margin: 0;
}

.employees-grid {
  padding-bottom: 2rem;
}

@media (max-width: 992px) {
  .filters-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .sort-filter,
  .status-filter,
  .search-filter {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .list-header {
    padding: 1.5rem;
  }
}
</style>