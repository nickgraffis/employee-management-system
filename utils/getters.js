const connection = require("../connection.js")
module.exports = {
  employees: function () {
    connection.query(
    "SELECT CONCAT(first_name,' ',last_name) AS employee, id FROM employee",
    (err, res) => {
      if (err) throw err
      return res
    })
  },

  departments: function () {
    connection.query(
    "SELECT name AS department, id FROM department;",
    (err, res) => {
      if (err) throw err
      return res
    })
  },

  roles: function () {
    connection.query(
    "SELECT title AS role, id FROM role;",
    (err, res) => {
      if (err) throw err
      return res
    })
  }
}
