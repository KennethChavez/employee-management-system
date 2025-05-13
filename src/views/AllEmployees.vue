<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '../stores/employee'
import { useCompanyStore } from '../stores/company'
import EmployeeCard from '../components/employee/EmployeeCard.vue'

const router = useRouter()
const employeeStore = useEmployeeStore()
const companyStore = useCompanyStore()

const allEmployees = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const sortOption = ref('name')
const statusFilter = ref('all')

onMounted(async () => {
  await fetchAllEmployees()
})

async function fetchAllEmployees() {
  isLoading.value = true
  try {
    const companies = ['nsh', 'tsn', 'oth']
    const employeesList = []
    
    for (const company of companies) {
      const employees = await employeeStore.getEmployees(company)
      employees.forEach(emp => {
        employeesList.push({
          ...emp,
          company
        })
      })
    }
    
    allEmployees.value = employeesList
  } catch (error) {
    console.error('Error fetching employees:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredEmployees = computed(() => {
  let result = allEmployees.value

  // Filter by status
  if (statusFilter.value !== 'all') {
    const isActive = statusFilter.value === 'active'
    result = result.filter(emp => emp.isActive === isActive)
  }

  // Filter by search
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(emp => 
      emp.firstName.toLowerCase().includes(search) ||
      emp.lastName.toLowerCase().includes(search) ||
      emp.employeeId.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search)
    )
  }

  // Sort
  return sortEmployees(result)
})

function sortEmployees(employees) {
  return [...employees].sort((a, b) => {
    switch (sortOption.value) {
      case 'name':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      case 'company':
        return a.company.localeCompare(b.company)
      case 'id':
        return a.employeeId.localeCompare(b.employeeId)
      default:
        return 0
    }
  })
}

const stats = computed(() => ({
  total: allEmployees.value.length,
  active: allEmployees.value.filter(emp => emp.isActive).length,
  inactive: allEmployees.value.filter(emp => !emp.isActive).length,
  byCompany: {
    nsh: allEmployees.value.filter(emp => emp.company === 'nsh').length,
    tsn: allEmployees.value.filter(emp => emp.company === 'tsn').length,
    oth: allEmployees.value.filter(emp => emp.company === 'oth').length
  }
}))
</script>

<template>
  <div class="all-employees fade-in">
    <div class="header-section">
      <h1>All Employees</h1>
      
      <div class="stats-cards">
        <div class="stat-card">
          <h3>Total Employees</h3>
          <div class="stat-value">{{ stats.total }}</div>
        </div>
        <div class="stat-card">
          <h3>Active</h3>
          <div class="stat-value text-success">{{ stats.active }}</div>
        </div>
        <div class="stat-card">
          <h3>Inactive</h3>
          <div class="stat-value text-danger">{{ stats.inactive }}</div>
        </div>
      </div>
      
      <div class="company-stats">
        <div class="company-stat" style="--company-color: var(--color-nsh)">
          <span class="company-name">NSH</span>
          <span class="company-count">{{ stats.byCompany.nsh }}</span>
        </div>
        <div class="company-stat" style="--company-color: var(--color-tsn)">
          <span class="company-name">TSN</span>
          <span class="company-count">{{ stats.byCompany.tsn }}</span>
        </div>
        <div class="company-stat" style="--company-color: var(--color-oth)">
          <span class="company-name">OTH</span>
          <span class="company-count">{{ stats.byCompany.oth }}</span>
        </div>
      </div>
    </div>
    
    <div class="filters-section">
      <div class="search-bar">
        <input 
          type="text"
          v-model="searchQuery"
          placeholder="Search employees..."
          class="search-input"
        >
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <label>Status:</label>
          <select v-model="statusFilter">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Sort by:</label>
          <select v-model="sortOption">
            <option value="name">Name</option>
            <option value="company">Company</option>
            <option value="id">ID</option>
          </select>
        </div>
      </div>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <p>Loading employees...</p>
    </div>
    
    <div v-else-if="filteredEmployees.length === 0" class="empty-state">
      <p>No employees found. Try adjusting your filters.</p>
    </div>
    
    <div v-else class="employees-grid">
      <EmployeeCard
        v-for="employee in filteredEmployees"
        :key="`${employee.company}-${employee.id}`"
        :employee="employee"
        :company="employee.company"
      />
    </div>
  </div>
</template>

<style scoped>
.all-employees {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header-section {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  padding: 2rem;
  border-radius: 12px;
  color: white;
}

.header-section h1 {
  margin: 0 0 1.5rem 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.text-success {
  color: var(--color-success);
}

.text-danger {
  color: var(--color-error);
}

.company-stats {
  display: flex;
  gap: 1rem;
}

.company-stat {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--company-color);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.company-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.filters-section {
  background: var(--color-card);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-bar {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text-primary);
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group select {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text-primary);
}

.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding-bottom: 2rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--color-card);
  border-radius: 12px;
  color: var(--color-text-secondary);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
  }
  
  .filters {
    width: 100%;
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-group select {
    width: 100%;
  }
  
  .company-stats {
    flex-direction: column;
  }
}

/* iPhone-specific adjustments */
@media screen and (max-width: 428px) {
  .header-section {
    padding: 1.5rem;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .employees-grid {
    grid-template-columns: 1fr;
  }
}

/* Safe area insets for modern iOS devices */
@supports (padding: max(0px)) {
  .all-employees {
    padding-bottom: max(2rem, env(safe-area-inset-bottom));
  }
}
</style>