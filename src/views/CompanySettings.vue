<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '../stores/company'

const props = defineProps({
  company: {
    type: String,
    required: true
  }
})

const router = useRouter()
const companyStore = useCompanyStore()

const companyDetails = computed(() => {
  const companies = {
    nsh: {
      name: 'NSH Corporation',
      fullName: 'North Star Holdings Corporation',
      description: 'A leading technology company specializing in software solutions.',
      color: 'var(--color-nsh)'
    },
    tsn: {
      name: 'TSN Enterprises',
      fullName: 'Technology Solutions Network Enterprises',
      description: 'Providing innovative networking and communication solutions.',
      color: 'var(--color-tsn)'
    },
    oth: {
      name: 'OTH Industries',
      fullName: 'Omni Tech Holdings Industries',
      description: 'Manufacturing and industrial technology solutions provider.',
      color: 'var(--color-oth)'
    }
  }
  
  return companies[props.company] || {
    name: props.company.toUpperCase(),
    fullName: props.company.toUpperCase(),
    description: 'Company description not available.',
    color: 'var(--color-primary)'
  }
})

const goBack = () => {
  router.push(`/employees/${props.company}`)
}
</script>

<template>
  <div class="company-settings fade-in">
    <div class="settings-header" :style="{ '--company-color': companyDetails.color }">
      <button class="back-btn" @click="goBack">
        Back to Employees
      </button>
      <h2>{{ companyDetails.name }} Settings</h2>
    </div>
    
    <div class="settings-content">
      <div class="card settings-card">
        <h3>Company Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Short Name</span>
            <span class="info-value">{{ companyDetails.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Full Name</span>
            <span class="info-value">{{ companyDetails.fullName }}</span>
          </div>
          <div class="info-item full-width">
            <span class="info-label">Description</span>
            <span class="info-value">{{ companyDetails.description }}</span>
          </div>
        </div>
      </div>
      
      <div class="card settings-card">
        <h3>Data Management</h3>
        <p class="settings-description">
          The employee data for {{ companyDetails.name }} is currently stored locally in your browser.
          You can export this data as a backup or import previously exported data.
        </p>
        
        <div class="data-actions">
          <button class="btn-secondary">Export Employee Data</button>
          <button class="btn-secondary">Import Employee Data</button>
        </div>
        
        <div class="danger-zone">
          <h4>Danger Zone</h4>
          <p>The following actions are destructive and cannot be undone.</p>
          <button class="btn-danger">Delete All Employees</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.company-settings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-header {
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

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-card {
  padding: 1.5rem;
}

.settings-card h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
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

.settings-description {
  margin-bottom: 1.5rem;
  color: var(--color-text-secondary);
}

.data-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.danger-zone {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.danger-zone h4 {
  color: var(--color-error);
  font-size: 1.125rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.danger-zone p {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.btn-danger {
  background-color: var(--color-error);
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .data-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>