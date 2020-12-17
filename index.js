const inquirer = require("inquirer")
const figlet = require("figlet")
const connection = require("./config/connection")
const now = require("./utils/querier.js")
const get = require('./utils/getters.js')
const query = require("./utils/query.js")
const check = require('./utils/checker.js')
const error = require('./utils/error.js')
const Prompt = require("./classes/Prompt")
const selector = require('./classes/selector')
let employees, departments, roles

connection.connect((err) => {
  figlet.text('EMS : )', {
    font: 'Ghost',
    width: 80
  }, (err, data) => {
      if (err) {
          console.log('Something went wrong...')
          return
      }
      console.log(data)
      check.tables().then(initApp)
  })
})

async function openMenu() {
  const show = new Prompt(
    employees.map(row => row.employee),
    departments.map(row => row.department),
    roles.map(row => row.role))
  const select = new selector(employees, departments, roles)
  const { main } = await inquirer.prompt(show.main())
  let creation, update, deletion, log
  switch (main) {
    case "View All Employees":
      now.run(query.all(), null, null, openMenu)
      return
    case "View Employees by Department":
      if (departments.length < 1) {
        error.message('You don\'t have any departments yet!', openMenu)
        return
      }
      const { department } = await inquirer.prompt(show.readDepartments())
      now.run(query.by('department.name'), select.just(department), null, openMenu)
      return
    case "View Employees by Role":
      if (roles.length < 1) {
        error.message('You don\'t have any roles yet!', openMenu)
        return
      }
      const { role } = await inquirer.prompt(show.readRoles())
      now.run(query.by('role.title'), select.just(role), null, openMenu)
      return
    case "View Employees by Manager":
      const { manager } = await inquirer.prompt(show.readManagers())
      now.run(query.by("CONCAT(m.first_name,' ',m.last_name)"), select.just(manager), null, openMenu)
      return
    case "Add an Employee":
      creation = await inquirer.prompt(show.createEmployee())
      log = `Sucessfully added ${creation.first_name} ${creation.last_name}!`
      now.run(query.create('employee'), select.createEmployee(creation), log, initApp)
      return
    case "Add a Role":
      if (departments.length < 1) {
        error.message('You don\'t have any departments yet!', openMenu)
        return
      }
      creation = await inquirer.prompt(show.createRole())
      log = `Added new role: ${creation.title}!`
      now.run(query.create('role'), select.createRole(creation), log, initApp)
      return
    case "Add a Department":
      creation = await inquirer.prompt(show.createDepartment())
      log = `Added new department: ${creation.name}!`
      now.run(query.create('department'), creation, log, initApp)
      return
    case "Remove an Employee":
      if (employees.length < 1) {
        error.message('You don\'t have any employees yet!', openMenu)
        return
      }
      deletion = await inquirer.prompt(show.readEmployees())
      log = `Removed ${deletion.employee}!`
      now.run(query.delete('employee'), select.deleteEmployee(deletion), log, initApp)
      return
    case "Remove a Department":
      if (departments.length < 1) {
        error.message('You don\'t have any departments yet!', openMenu)
        return
      }
      deletion = await inquirer.prompt(show.readDepartments())
      proceed = await confirm(show, 'Are you sure, employees and roles in this department will be lost!');
      if (!proceed) return openMenu();
      log = `Removed ${deletion.department}!`
      now.run(query.delete('department'), select.deleteDepartment(deletion), log, initApp)
      return
    case "Remove a Role":
      if (roles.length < 1) {
        error.message('You don\'t have any roles yet!', openMenu)
        return
      }
      deletion = await inquirer.prompt(show.readRoles())
      proceed = await confirm(show, 'Are you sure, employees with this role will be lost!');
      if (!proceed) return openMenu();
      log = `Removed ${deletion.role}!`
      now.run(query.delete('role'), select.deleteRole(deletion), log, initApp)
      return
    case "Update an Employee's Role":
      if (employees.length < 1) {
        error.message('You don\'t have any employees yet!', openMenu)
        return
      }
      update = await inquirer.prompt(show.updateRole())
      log = `Updated ${update.employee} with role ${update.role}!`
      now.run(query.update("role_id"), select.updateEmployeeRole(update), log, initApp)
      return
    case "Update an Employee's Manager":
      if (employees.length < 1) {
        error.message('You don\'t have any employees yet!', openMenu)
        return
      }
      update = await inquirer.prompt(show.updateManager())
      log = `Updated ${update.employee} with manager ${update.manager}!`
      now.run(query.update("manager_id"), select.updateEmployeeManager(update), log, initApp)
      return
    case "View Utilized Budget by Department":
      if (departments.length < 1) {
        error.message('You don\'t have any departments yet!', openMenu)
        return
      }
      const { department: utilDepartment } = await inquirer.prompt(show.readDepartments());
      now.run(query.deptBudget(), select.just(utilDepartment), null, openMenu)
      return
    default:
    connection.end()
    return
  }
}

function confirm(show, message) {
  return inquirer.prompt(show.confirm(message)).then(res => res.proceed);
};

async function initApp() {
  employees = await get.employees()
  departments = await get.departments()
  roles = await get.roles()
  openMenu()
}
