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
  const Inquire = new Prompt(employees, departments, roles)
  const Select = new Selector(employees, departments, roles)
  const { main } = await inquirer.prompt(Inquire.main())
  let creation, update, deletion, log
  switch (main) {
    case "View All Employees":
      await now.run(Query.all())
      openMenu()
    case "View Employees by Department":
      const { department } = await inquirer.prompt(Inquire.readDepartments())
      await now.run(Query.by('department.name'), Select.find(department))
      openMenu()
    case "View Employees by Role":
      const { role } = await inquirer.prompt(Inquire.readRoles())
      await now.run(Query.by('role.title'), Select.find(role))
      openMenu()
    case "View Employees by Manager":
      const { manager } = await inquirer.prompt(Inquire.readManagers())
      await now.run(Query.by("CONCAT(m.first_name,' ',m.last_name)"), Select.find(manager))
      openMenu()
    case "Add an Employee":
      creation = await inquirer.prompt(Inquire.createEmployee())
      log = `Sucessfully added ${creation.first_name} ${creation.last_name}!`
      await now.run(Query.create('employee'), Select.createEmployee(creation), log)
      initApp()
    case "Add a Role":
      creation = await inquirer.prompt(Inquire.createRole())
      log = `Added new role: ${creation.title}!`
      await now.run(Query.create('role'), Select.createRole(creation), log)
      initApp()
    case "Add a Department":
      creation = await inquirer.prompt(Inquire.createDepartment())
      log = `Added new department: ${creation.name}!`
      await now.run(Query.create('department'), creation, log)
      initApp()
    case "Remove an Employee":
      deletion = await inquirer.prompt(Inquire.readEmployees())
      log = `Removed ${deletion.employee}!`
      await now.run(Query.delete(), Select.deleteEmployee(deletion), log)
      initApp()
    case "Update Employee Role":
      update = await inquirer.prompt(Inquire.updateRole())
      log = `Updated ${update.employee} with role ${update.role}!`
      await now.run(Query.update("role_id"), Select.updateEmployeeRole(update), log)
      initApp()
    case "Update Employee Manager":
      update = await inquirer.prompt(Inquire.updateManager())
      log = `Updated ${update.employee} with manager ${update.manager}!`
      await now.run(Query.update("manager_id"), Select.updateEmployeeManager(update), log)
      initApp()
    case "View Utilized Budget by Department":
      const { department: utilDepartment } = await inquirer.prompt(Inquire.readDepartments());
      await now.run(Query.deptBudget(), Select.find(utilDepartment))
      openMenu()
    default:
    connection.end()
    return
  }
}

async function initApp() {
  employees = await  get.employees()
  departments = await  get.departments()
  roles = await get.roles()
  openMenu()
}
