const inquirer = require("inquirer")
const chalk = require("chalk")
const figlet = require("figlet")
const connection = require("./connection")
const now = require("./utils/querier.js")
const get = require('./utils/getters.js')
const Prompt = require("./Prompt")
const Query = require("./Query")
const Selector = require('./Selector')

let employees = [];
let departments = [];
let roles = [];

connection.connect((err) => {
  figlet.text('Welcome to Employee Management System :)', {
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }, function(err, data) {
      if (err) {
          console.log('Something went wrong...')
          console.dir(err)
          return
      }
      console.log(data)
      initApp()
  })
})

async function openMenu() {
  const Inquire = new Prompt(
    employees.map(row => row.employee),
    departments.map(row => row.department),
    roles.map(row => row.role))
  const Select = new Selector(employees, departments, roles)
  const { main } = await inquirer.prompt(Inquire.main())
  let creation, update, deletion, log
  switch (main) {
    case "View All Employees":
      now.run(Query.all(), null, null, openMenu)
      return
    case "View Employees by Department":
      const { department } = await inquirer.prompt(Inquire.readDepartments())
      now.run(Query.by('department.name'), Select.find(department), null, openMenu)
      return
    case "View Employees by Role":
      const { role } = await inquirer.prompt(Inquire.readRoles())
      now.run(Query.by('role.title'), Select.find(role), null, openMenu)
      return
    case "View Employees by Manager":
      const { manager } = await inquirer.prompt(Inquire.readManagers())
      now.run(Query.by("CONCAT(m.first_name,' ',m.last_name)"), Select.find(manager), null, openMenu)
      return
    case "Add an Employee":
      creation = await inquirer.prompt(Inquire.createEmployee())
      log = `Sucessfully added ${creation.first_name} ${creation.last_name}!`
      now.run(Query.create('employee'), Select.createEmployee(creation), log, initApp)
      return
    case "Add a Role":
      creation = await inquirer.prompt(Inquire.createRole())
      log = `Added new role: ${creation.title}!`
      now.run(Query.create('role'), Select.createRole(creation), log, initApp)
      return
    case "Add a Department":
      creation = await inquirer.prompt(Inquire.createDepartment())
      log = `Added new department: ${creation.name}!`
      now.run(Query.create('department'), creation, log, initApp)
      return
    case "Remove an Employee":
      deletion = await inquirer.prompt(Inquire.readEmployees())
      log = `Removed ${deletion.employee}!`
      now.run(Query.delete(), Select.deleteEmployee(deletion), log, initApp)
      return
    case "Update an Employee's Role":
      update = await inquirer.prompt(Inquire.updateRole())
      log = `Updated ${update.employee} with role ${update.role}!`
      now.run(Query.update("role_id"), Select.updateEmployeeRole(update), log, initApp)
      return
    case "Update an Employee's Manager":
      update = await inquirer.prompt(Inquire.updateManager())
      log = `Updated ${update.employee} with manager ${update.manager}!`
      now.run(Query.update("manager_id"), Select.updateEmployeeManager(update), log, initApp)
      return
    case "View Utilized Budget by Department":
      const { department: utilDepartment } = await inquirer.prompt(Inquire.readDepartments());
      now.run(Query.deptBudget(), Select.find(utilDepartment), null, openMenu)
      return
    default:
    connection.end()
    return
  }
}

async function initApp() {
  employees = await get.employees()
  departments = await get.departments()
  roles = await get.roles()
  openMenu()
}
