require('dotenv').config();
const connection = require("../config/connection.js")
const chalk = require('chalk')
const requiredTables = ['employee', 'department', 'role']
const queries = require('./queries.js')

async function asyncForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
}

function checkTable (table) {
  return new Promise((resolve, reject) => {
      connection.query(queries.checkTable(table), null, (err, res) => {
      if (err) {
        console.log(chalk.red(err));
        if(err == 'Error: Cannot enqueue Query after fatal error.') {
          console.log(chalk.yellow('This probably means your database credentials are inaccurate, check your .env file!'))
        }
      } else {
        if (res.length > 0) {
          console.log(chalk.green(`${table} table exists!`))
          resolve()
        } else {
            connection.query(eval('queries.create' + table + 'Table'), null, (err, res) => {
              if (err) {
                console.log(chalk.red(err));
              } else {
                console.log(chalk.green(`Created ${table} table!`))
            }
            resolve()
          })
        }
      }
    })
  })
}

module.exports = {
  tables: async function () {
    console.log(chalk.magenta('Welcome to Employee Management System! Let\'s check your database!'))
    await asyncForEach(requiredTables, async function (table) {
      console.log(chalk.blue(`Checking if ${table} table exists...`))
      await checkTable(table)
    })
    return this
  },

  then: function (callback) {
    callback()
  }
}
