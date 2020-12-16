const prompts = require('./utils/prompts.js')

class Prompt {
  constructor (employees, departments, roles) {
    this.employees = employees,
    this.departments = departments,
    this.roles = roles
  }

  main() {
    return prompts.main
  }

  readDepartments() {
    return prompts.departments(this.departments)
  }

  readEmployees() {
    return prompts.employees(this.employees)
  }

  readRoles() {
    return prompts.roles(this.roles)
  }

  readManagers() {
    return prompts.managers(this.employees)
  }

  createEmployee() {
    return prompts.createEmployee
  }

  createRole() {
    return prompts.createRole
  }

  createDepartment() {
    return prompts.createDepartment
  }

  updateRole() {
    return [
      this.readEmployees()[0],
      this.readRoles()[0]
    ]
  }

  updateManager() {
    return [
      this.readEmployees()[0],
      this.readManagers()[0]
    ]
  }
}

module.exports = Prompt
