const connection = require("../connection.js")
const chalk = require('chalk')

connection.connect((err) => {

})

module.exports = {
  run: function (query, selector, log, callback) {
    connection.query(query, selector, (err, res) => {
      if (err) {
        console.log(chalk.red('\n'+err.sqlMessage));
      } else {
        if (res.length) console.table(res)
        if (log) console.log(chalk.green('\n' + log))
      }
      callback()
    })
  }
}
