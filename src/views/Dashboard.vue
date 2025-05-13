<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '../stores/company'
import { useEmployeeStore } from '../stores/employee'

const router = useRouter()
const companyStore = useCompanyStore()
const employeeStore = useEmployeeStore()

const companyStats = ref([
  { id: 'nsh', name: 'NSH', fullName: 'Nueva Sociedad Hotelera', color: 'var(--color-nsh)', employees: 0, activeEmployees: 0 },
  { id: 'tsn', name: 'TSN', fullName: 'Turismo y Servicios Nacionales', color: 'var(--color-tsn)', employees: 0, activeEmployees: 0 },
  { id: 'oth', name: 'OTH', fullName: 'O T H', color: 'var(--color-oth)', employees: 0, activeEmployees: 0 }
])

const recentEmployees = ref([])

onMounted(async () => {
  // Get employee counts for each company
  for (const company of companyStats.value) {
    const employees = await employeeStore.getEmployees(company.id)
    company.employees = employees.length
    company.activeEmployees = employees.filter(emp => emp.isActive).length
  }
  
  // Get recent employees across all companies
  const allEmployees = []
  for (const company of companyStats.value) {
    const employees = await employeeStore.getEmployees(company.id)
    employees.forEach(emp => {
      allEmployees.push({
        ...emp,
        company: company.id
      })
    })
  }
  
  // Sort by hire date and take the 5 most recent
  recentEmployees.value = allEmployees
    .sort((a, b) => new Date(b.hireDate || 0) - new Date(a.hireDate || 0))
    .slice(0, 5)
})

const totalEmployees = computed(() => {
  return companyStats.value.reduce((sum, company) => sum + company.employees, 0)
})

const activeEmployees = computed(() => {
  return companyStats.value.reduce((sum, company) => sum + company.activeEmployees, 0)
})

const inactiveEmployees = computed(() => {
  return totalEmployees.value - activeEmployees.value
})

const navigateToCompany = (companyId) => {
  router.push(`/employees/${companyId}`)
}

const navigateToEmployee = (employee) => {
  router.push(`/employees/${employee.company}/${employee.id}`)
}

const getEmployeeStatusClass = (isActive) => {
  return isActive ? 'badge-active' : 'badge-inactive'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const formatSalary = (salary) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2
  }).format(salary)
}
</script>

<template>
  <div class="dashboard fade-in">
    <div class="dashboard-stats">
      <div class="stats-card card">
        <h3>Employee Overview</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ totalEmployees }}</div>
            <div class="stat-label">Total Employees</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ activeEmployees }}</div>
            <div class="stat-label">Active Employees</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ inactiveEmployees }}</div>
            <div class="stat-label">Inactive Employees</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="companies-section">
      <h2>Companies</h2>
      <div class="companies-grid">
        <div 
          v-for="company in companyStats" 
          :key="company.id" 
          class="company-card card"
          :style="{ '--company-color': company.color }"
          @click="navigateToCompany(company.id)"
        >
          <div class="company-header">
            <h3 class="company-name">{{ company.name }}</h3>
            <p class="company-fullname">{{ company.fullName }}</p>
          </div>
          <div class="company-stats">
            <div class="company-stat">
              <div class="stat-value">{{ company.employees }}</div>
              <div class="stat-label">Employees</div>
            </div>
            <div class="company-stat">
              <div class="stat-value">{{ company.activeEmployees }}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="company-stat">
              <div class="stat-value">{{ company.employees - company.activeEmployees }}</div>
              <div class="stat-label">Inactive</div>
            </div>
          </div>
          <div class="company-action">
            <button class="view-btn">View Employees</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="recent-section">
      <h2>Recently Hired</h2>
      <div class="card">
        <table class="recent-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Hire Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in recentEmployees" :key="employee.id" @click="navigateToEmployee(employee)">
              <td class="name-cell">{{ employee.firstName }} {{ employee.lastName }}</td>
              <td>{{ employee.company.toUpperCase() }}</td>
              <td>{{ employee.position }}</td>
              <td>{{ formatSalary(employee.salary) }}</td>
              <td>{{ formatDate(employee.hireDate) }}</td>
              <td>
                <span class="badge" :class="getEmployeeStatusClass(employee.isActive)">
                  {{ employee.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
            <tr v-if="recentEmployees.length === 0">
              <td colspan="6" class="no-data">No recent employees found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-stats {
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.stat-label {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.companies-section,
.recent-section {
  margin-bottom: 1rem;
}

.companies-section h2,
.recent-section h2 {
  margin-bottom: 1rem;
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.company-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  padding: 0;
}

.company-header {
  background-color: var(--company-color);
  padding: 1.5rem;
  color: white;
}

.company-name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.company-fullname {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.company-stats {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
}

.company-stat {
  text-align: center;
}

.company-action {
  padding: 0 1.5rem 1.5rem 1.5rem;
  display: flex;
  justify-content: center;
}

.view-btn {
  background-color: var(--company-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: opacity 0.2s ease;
}

.view-btn:hover {
  opacity: 0.9;
}

.recent-table {
  width: 100%;
  border-collapse: collapse;
}

.recent-table th,
.recent-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.recent-table th {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.recent-table tbody tr {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.recent-table tbody tr:hover {
  background-color: var(--color-hover);
}

.name-cell {
  font-weight: 500;
}

.no-data {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem;
}

@media (max-width: 992px) {
  .companies-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .companies-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .recent-table th:nth-child(3),
  .recent-table td:nth-child(3),
  .recent-table th:nth-child(4),
  .recent-table td:nth-child(4) {
    display: none;
  }
}
</style>