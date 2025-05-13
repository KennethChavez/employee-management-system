<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '../stores/employee'
import EmployeeFormComponent from '../components/employee/EmployeeForm.vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  company: {
    type: String,
    required: true
  },
  id: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const employeeStore = useEmployeeStore()

const employee = ref(null)
const isLoading = ref(false)
const error = ref(null)

const isEdit = computed(() => !!props.id)

onMounted(async () => {
  if (isEdit.value) {
    await fetchEmployee()
  } else {
    // Initialize a new employee
    employee.value = {
      id: uuidv4(),
      item: '',
      employeeId: '',
      firstName: '',
      lastName: '',
      age: '',
      phone: '',
      address: '',
      salary: '',
      email: '',
      hireDate: '',
      isActive: true,
      photo: ''
    }
  }
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
    
    employee.value = { ...employeeData }
  } catch (err) {
    console.error('Error fetching employee:', err)
    error.value = 'Failed to load employee data'
  } finally {
    isLoading.value = false
  }
}

const saveEmployee = async (employeeData) => {
  try {
    if (isEdit.value) {
      await employeeStore.updateEmployee(props.company, props.id, employeeData)
    } else {
      await employeeStore.addEmployee(props.company, employeeData)
    }
    
    router.push(`/employees/${props.company}/${employeeData.id}`)
  } catch (err) {
    console.error('Error saving employee:', err)
    // Show error notification
  }
}

const cancelForm = () => {
  if (isEdit.value) {
    router.push(`/employees/${props.company}/${props.id}`)
  } else {
    router.push(`/employees/${props.company}`)
  }
}
</script>

<template>
  <div class="employee-form-view">
    <div v-if="isLoading" class="loading-state">
      <p>Loading...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="btn-primary" @click="router.push(`/employees/${company}`)">
        Back to Employee List
      </button>
    </div>
    
    <template v-else-if="employee">
      <EmployeeFormComponent 
        :employee="employee" 
        :isEdit="isEdit" 
        :company="company"
        @save="saveEmployee" 
        @cancel="cancelForm"
      />
    </template>
  </div>
</template>

<style scoped>
.employee-form-view {
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
</style>