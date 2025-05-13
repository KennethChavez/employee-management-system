<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '../stores/employee'
import EmployeeDetailComponent from '../components/employee/EmployeeDetail.vue'

const props = defineProps({
  company: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const employeeStore = useEmployeeStore()

const employee = ref(null)
const isLoading = ref(true)
const error = ref(null)
const showConfirmDelete = ref(false)

onMounted(async () => {
  await fetchEmployee()
})

async function fetchEmployee() {
  isLoading.value = true
  error.value = null
  
  try {
    const employeeData = await employeeStore.getEmployee(props.company, props.id)
    
    if (!employeeData) {
      error.value = 'Employee not found'
      return
    }
    
    employee.value = employeeData
  } catch (err) {
    console.error('Error fetching employee:', err)
    error.value = 'Failed to load employee data'
  } finally {
    isLoading.value = false
  }
}

const handleEdit = () => {
  router.push(`/employees/${props.company}/${props.id}/edit`)
}

const handleDelete = () => {
  showConfirmDelete.value = true
}

const confirmDelete = async () => {
  try {
    await employeeStore.deleteEmployee(props.company, props.id)
    router.push(`/employees/${props.company}`)
  } catch (err) {
    console.error('Error deleting employee:', err)
    // Show error notification
  } finally {
    showConfirmDelete.value = false
  }
}

const cancelDelete = () => {
  showConfirmDelete.value = false
}
</script>

<template>
  <div class="employee-detail-view">
    <div v-if="isLoading" class="loading-state">
      <p>Loading employee data...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="btn-primary" @click="router.push(`/employees/${company}`)">
        Back to Employee List
      </button>
    </div>
    
    <template v-else-if="employee">
      <EmployeeDetailComponent 
        :employee="employee" 
        :company="company" 
        @edit="handleEdit" 
        @delete="handleDelete"
      />
      
      <!-- Delete Confirmation Modal -->
      <div v-if="showConfirmDelete" class="delete-modal-backdrop">
        <div class="delete-modal card">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete {{ employee.firstName }} {{ employee.lastName }}?</p>
          <p class="warning-text">This action cannot be undone.</p>
          
          <div class="modal-actions">
            <button class="btn-secondary" @click="cancelDelete">Cancel</button>
            <button class="btn-danger" @click="confirmDelete">Delete Employee</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.employee-detail-view {
  position: relative;
}

.loading-state,
.error-state {
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

.error-state p {
  color: var(--color-error);
}

.delete-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-modal {
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  background-color: var(--color-card);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.delete-modal h3 {
  margin-top: 0;
  color: var(--color-error);
}

.warning-text {
  color: var(--color-error);
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
}
</style>