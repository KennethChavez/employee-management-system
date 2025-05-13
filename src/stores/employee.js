import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import employeeData from '../data/employees.json'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref(employeeData)
  const searchQuery = ref('')
  
  // Initialize with sample data
  const initializeStore = () => {
    const savedData = localStorage.getItem('employees')
    if (savedData) {
      employees.value = JSON.parse(savedData)
    } else {
      saveToLocalStorage()
    }
  }
  
  // Save current state to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('employees', JSON.stringify(employees.value))
  }
  
  // Get all employees for a company
  const getEmployees = async (company) => {
    if (!employees.value[company]) {
      employees.value[company] = []
      saveToLocalStorage()
    }
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return employees.value[company]
  }
  
  // Get a specific employee
  const getEmployee = async (company, id) => {
    if (!employees.value[company]) {
      return null
    }
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return employees.value[company].find(emp => emp.id === id) || null
  }
  
  // Add a new employee
  const addEmployee = async (company, employee) => {
    if (!employees.value[company]) {
      employees.value[company] = []
    }
    
    if (!employee.id) {
      employee.id = uuidv4()
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    employees.value[company].push(employee)
    saveToLocalStorage()
    
    return employee
  }
  
  // Update an existing employee
  const updateEmployee = async (company, id, updatedEmployee) => {
    if (!employees.value[company]) {
      throw new Error('Company not found')
    }
    
    const index = employees.value[company].findIndex(emp => emp.id === id)
    if (index === -1) {
      throw new Error('Employee not found')
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    employees.value[company][index] = { ...updatedEmployee, id }
    saveToLocalStorage()
    
    return employees.value[company][index]
  }
  
  // Delete an employee
  const deleteEmployee = async (company, id) => {
    if (!employees.value[company]) {
      throw new Error('Company not found')
    }
    
    const index = employees.value[company].findIndex(emp => emp.id === id)
    if (index === -1) {
      throw new Error('Employee not found')
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    employees.value[company].splice(index, 1)
    saveToLocalStorage()
    
    return true
  }
  
  // Set search query
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }
  
  // Get search query
  const getSearchQuery = () => {
    return searchQuery.value
  }
  
  // Initialize the store
  initializeStore()
  
  return {
    getEmployees,
    getEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    setSearchQuery,
    getSearchQuery
  }
})