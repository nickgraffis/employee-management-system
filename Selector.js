class Selector {
  constructor (employees, departments, roles) {
    this.employees = employees,
    this.departments = departments,
    this.roles = roles
  }

  find (...selector) {
    return selector
  }

  createEmployee (creation) {
    const roleId = this.getRoleId(creation.role)
    const managerId = this.getManagerId(creation.manager)
    return {
      first_name: creation.first_name,
      last_name: creation.last_name,
      role_id: roleId,
      manager_id: managerId,
    };
  }

  createRole (creation) {
    const deptId = this.getDeptId(creation.department)
    return {
      title: creation.title,
      salary: creation.salary,
      department_id: deptId
    };
  }

  updateEmployeeRole (update) {
    const employeeId = this.getEmployeeId(update.employee)
    const roleId = this.getRoleId(update.role)
    return this.find(roleId, employeeId)
  }

  updateEmployeeManager (update) {
    const employeeId = this.getEmployeeId(update.employee)
    const managerId = this.getManagerId(update.manager)
    return this.find(managerId, employeeId)
  }

  deleteEmployee (deletion) {
    const employeeId = this.getEmployeeId(deletion.employee)
    return this.find(employeeId)
  }

  getRoleId (role) {
    return this.roles.find(el => el.role === role).id
  }

  getEmployeeId (employee) {
    return this.employees.find(el => el.employee === employee).id
  }

  getManagerId (employee) {
    const manager = this.employees.find(el => el.employee === employee)
    return manager ? manager.id : null
  }

  getDeptId (department) {
    return this.departments.find(el => el.department === department).id;
  }
}

module.exports = Selector
