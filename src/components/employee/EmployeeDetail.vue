<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  },
  company: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const router = useRouter()

const statusClass = computed(() => {
  return props.employee.isActive ? 'badge-active' : 'badge-inactive'
})

const statusText = computed(() => {
  return props.employee.isActive ? 'Active' : 'Inactive'
})

const formattedDate = computed(() => {
  if (!props.employee.hireDate) return 'N/A'
  
  const date = new Date(props.employee.hireDate)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
})

const getProfileImage = () => {
  if (props.employee.photo) {
    return props.employee.photo
  }
  return 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300'
}

const companyColor = computed(() => {
  const colors = {
    nsh: 'var(--color-nsh)',
    tsn: 'var(--color-tsn)',
    oth: 'var(--color-oth)'
  }
  return colors[props.company] || 'var(--color-primary)'
})

const handleEdit = () => {
  emit('edit')
}

const handleDelete = () => {
  emit('delete')
}

const goBack = () => {
  router.push(`/employees/${props.company}`)
}
</script>

<template>
  <div class="employee-detail fade-in">
    <div class="detail-header" :style="{ '--company-color': companyColor }">
      <button class="back-btn" @click="goBack">
        Back to List
      </button>
      
      <div class="profile-section">
        <div class="profile-image">
          <img :src="getProfileImage()" alt="Profile photo" />
        </div>
        
        <div class="profile-info">
          <h2 class="employee-name">{{ employee.firstName }} {{ employee.lastName }}</h2>
          <span class="badge" :class="statusClass">{{ statusText }}</span>
          <p class="employee-id">ID: {{ employee.employeeId }}</p>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn-secondary" @click="handleEdit">Edit</button>
        <button class="btn-danger" @click="handleDelete">Delete</button>
      </div>
    </div>
    
    <div class="detail-content">
      <div class="detail-section">
        <h3>Personal Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">First Name</span>
            <span class="info-value">{{ employee.firstName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Last Name</span>
            <span class="info-value">{{ employee.lastName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Age</span>
            <span class="info-value">{{ employee.age || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">{{ employee.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Phone</span>
            <span class="info-value">{{ employee.phone }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Address</span>
            <span class="info-value">{{ employee.address }}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3>Employment Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Employee ID</span>
            <span class="info-value">{{ employee.employeeId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Item</span>
            <span class="info-value">{{ employee.item }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Hire Date</span>
            <span class="info-value">{{ formattedDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Salary</span>
            <span class="info-value">${{ employee.salary.toLocaleString() }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status</span>
            <span class="info-value badge" :class="statusClass">{{ statusText }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.employee-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-header {
  position: relative;
  background: linear-gradient(135deg, var(--company-color), color-mix(in srgb, var(--company-color) 70%, white));
  border-radius: 12px;
  padding: 2rem;
  color: white;
}

.back-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.employee-name {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.employee-id {
  margin: 0;
  opacity: 0.8;
}

.action-buttons {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.action-buttons button {
  padding: 0.5rem 1rem;
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.btn-danger {
  background-color: rgba(239, 68, 68, 0.8);
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: rgba(239, 68, 68, 1);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  background-color: var(--color-card);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-section h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: var(--color-text-primary);
}

@media (max-width: 768px) {
  .profile-section {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }
  
  .action-buttons {
    position: static;
    margin-top: 1.5rem;
    justify-content: center;
  }
  
  .back-btn {
    top: 0.5rem;
    left: 0.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>