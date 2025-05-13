import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCompanyStore = defineStore('company', () => {
  const companies = ref([
    { 
      id: 'nsh',
      name: 'NSH Corporation',
      fullName: 'Nueva Sociedad Hotelera',
      description: 'A leading technology company specializing in software solutions.',
      color: 'var(--color-nsh)'
    },
    { 
      id: 'tsn',
      name: 'TSN ',
      fullName: 'Turismo y Servicios Nacionales',
      description: 'Providing innovative networking and communication solutions.',
      color: 'var(--color-tsn)'
    },
    { 
      id: 'oth',
      name: 'OTH ',
      fullName: 'O T H',
      description: 'Hotel industrial technology solutions provider.',
      color: 'var(--color-oth)'
    }
  ])
  
  // Get all companies
  const getCompanies = () => {
    return companies.value
  }
  
  // Get a specific company by ID
  const getCompany = (id) => {
    return companies.value.find(company => company.id === id) || null
  }
  
  return {
    getCompanies,
    getCompany
  }
})