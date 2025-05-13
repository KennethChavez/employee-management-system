<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  employee: {
    type: Object,
    default: () => ({
      id: '',
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
    })
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  company: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  ...props.employee
})

const photoFile = ref(null)
const photoPreview = ref(props.employee.photo || '')

const router = useRouter()

const isFormValid = computed(() => {
  return (
    form.value.item.trim() !== '' &&
    form.value.employeeId.trim() !== '' &&
    form.value.firstName.trim() !== '' &&
    form.value.lastName.trim() !== '' &&
    form.value.email.trim() !== ''
  )
})

onMounted(() => {
  if (props.isEdit) {
    form.value = { ...props.employee }
    photoPreview.value = props.employee.photo || ''
  }
})

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  photoFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
    form.value.photo = e.target.result
  }
  reader.readAsDataURL(file)
}

const saveEmployee = () => {
  if (!isFormValid.value) return
  
  const employeeData = {
    ...form.value,
    salary: Number(form.value.salary) || 0,
    age: Number(form.value.age) || 0
  }
  
  emit('save', employeeData)
}

const cancel = () => {
  emit('cancel')
}

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
  <div class="employee-form fade-in">
    <div class="form-header" :style="{ '--company-color': companyColor }">
      <h2>{{ isEdit ? 'Edit Employee' : 'Add New Employee' }}</h2>
    </div>
    
    <div class="form-content">
      <div class="form-photo">
        <div class="photo-preview" @click="$refs.photoInput.click()">
          <img v-if="photoPreview" :src="photoPreview" alt="Profile photo" />
          <div v-else class="no-photo">
            <span>Add Photo</span>
          </div>
        </div>
        <input
          ref="photoInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handlePhotoChange"
        >
        <button class="photo-btn" @click="$refs.photoInput.click()">{{ photoPreview ? 'Change Photo' : 'Add Photo' }}</button>
      </div>
      
      <div class="form-fields">
        <div class="form-section">
          <h3>Personal Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name *</label>
              <input type="text" class="form-input" v-model="form.firstName" required>
            </div>
            <div class="form-group">
              <label class="form-label">Last Name *</label>
              <input type="text" class="form-input" v-model="form.lastName" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Age</label>
              <input type="number" class="form-input" v-model="form.age">
            </div>
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input type="email" class="form-input" v-model="form.email" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="tel" class="form-input" v-model="form.phone">
            </div>
            <div class="form-group">
              <label class="form-label">Address</label>
              <input type="text" class="form-input" v-model="form.address">
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Employment Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Item *</label>
              <input type="text" class="form-input" v-model="form.item" required>
            </div>
            <div class="form-group">
              <label class="form-label">Employee ID *</label>
              <input type="text" class="form-input" v-model="form.employeeId" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Hire Date</label>
              <input type="date" class="form-input" v-model="form.hireDate">
            </div>
            <div class="form-group">
              <label class="form-label">Salary</label>
              <input type="number" class="form-input" v-model="form.salary">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group status-group">
              <label class="form-label">Status</label>
              <div class="toggle-switch">
                <input type="checkbox" id="status-toggle" v-model="form.isActive">
                <label for="status-toggle"></label>
                <span class="toggle-label">{{ form.isActive ? 'Active' : 'Inactive' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="form-actions">
      <button class="btn-secondary" @click="cancel">Cancel</button>
      <button class="btn-primary" @click="saveEmployee" :disabled="!isFormValid">Save Employee</button>
    </div>
  </div>
</template>

<style scoped>
.employee-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  background: linear-gradient(135deg, var(--company-color), color-mix(in srgb, var(--company-color) 70%, white));
  border-radius: 12px;
  padding: 1.5rem 2rem;
  color: white;
}

.form-header h2 {
  margin: 0;
}

.form-content {
  display: flex;
  gap: 2rem;
  background-color: var(--color-card);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.photo-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px dashed var(--color-border);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background);
  transition: border-color 0.2s ease;
}

.photo-preview:hover {
  border-color: var(--color-primary);
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.photo-btn {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.photo-btn:hover {
  background-color: var(--color-primary);
  color: white;
}

.form-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
}

.status-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-switch label {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  background-color: var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.toggle-switch label:after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease;
}

.toggle-switch input[type="checkbox"]:checked + label {
  background-color: var(--color-success);
}

.toggle-switch input[type="checkbox"]:checked + label:after {
  transform: translateX(24px);
}

.toggle-label {
  font-size: 0.875rem;
  color: var(--color-text-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .form-content {
    flex-direction: column;
    align-items: center;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>