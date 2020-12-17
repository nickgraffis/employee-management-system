const chalk = require('chalk')

module.exports = {
  message: function (message, callback) {
    console.log(chalk.red(message))
    callback()
  }
}
