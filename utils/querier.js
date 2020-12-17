const connection = require("../config/connection.js")
const chalk = require('chalk')

module.exports = {
  run: function (query, selector, log, callback) {
    connection.query(query, selector, (err, res) => {
      if (err) {
        console.log(chalk.red(err));
      } else {
        if (res.length) console.table(res)
        if (log) console.log(chalk.green('\n' + log))
      }
      callback()
    })
  }
}
