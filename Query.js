const queries = require('./utils/queries.js')

module.exports = {
  all: function () {
    return queries.all + 'ORDER BY department.name'
  },

  by: function (column) {
    return queries.all + `WHERE ${column} = ? ORDER BY department.name`
  },

  create: function (table) {
    return `INSERT INTO ${table} SET ?`
  },

  delete: function () {
    return "DELETE FROM employee WHERE id = ?"
  },

  update: function(column) {
    return `UPDATE employee SET ${column} = ? WHERE id = ?`
  },

  deptBudget: function() {
    return queries.deptBudget
  }
}
