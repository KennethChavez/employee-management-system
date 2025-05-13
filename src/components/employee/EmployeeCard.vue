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

const navigateToDetails = () => {
  router.push(`/employees/${props.company}/${props.employee.id}`)
}

const getProfileImage = () => {
  if (props.employee.photo) {
    return props.employee.photo
  }
  return 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=150'
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
  <div class="employee-card card slide-in" @click="navigateToDetails">
    <div class="card-header" :style="{ '--company-color': companyColor }">
      <div class="profile-image">
        <img :src="getProfileImage()" alt="Profile photo" />
      </div>
      <div class="status-badge">
        <span class="badge" :class="statusClass">{{ statusText }}</span>
      </div>
    </div>
    
    <div class="card-body">
      <h3 class="employee-name">{{ employee.firstName }} {{ employee.lastName }}</h3>
      
      <div class="employee-info">
        <div class="info-item">
          <span class="info-label">ID:</span>
          <span class="info-value">{{ employee.employeeId }}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Email:</span>
          <span class="info-value">{{ employee.email }}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Hire Date:</span>
          <span class="info-value">{{ formattedDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.employee-card {
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.card-header {
  position: relative;
  height: 100px;
  background: linear-gradient(135deg, var(--company-color), color-mix(in srgb, var(--company-color) 70%, white));
  margin-bottom: 60px;
}

.profile-image {
  position: absolute;
  bottom: -40px;
  left: 24px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid var(--color-card);
  background-color: var(--color-card);
  overflow: hidden;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
}

.card-body {
  padding: 24px;
}

.employee-name {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.25rem;
  font-weight: 600;
}

.employee-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: baseline;
}

.info-label {
  min-width: 80px;
  font-weight: 500;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.info-value {
  color: var(--color-text-primary);
}
</style>