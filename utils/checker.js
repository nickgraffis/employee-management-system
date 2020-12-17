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
        console.log(chalk.red('\n' + err.sqlMessage));
      } else {
        if (res.length > 0) {
          console.log(chalk.green(`${table} table exists!`))
          resolve()
        } else {
            connection.query(eval('queries.create' + table + 'Table'), null, (err, res) => {
              if (err) {
                console.log(chalk.red('\n' + err.sqlMessage));
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
  tables: async function (callback) {
    console.log(chalk.magenta('Welcome to Employee Management System! Let\'s check your database!'))
    await asyncForEach(requiredTables, async function (table) {
      console.log(chalk.blue(`Checking if ${table} table exists...`))
      await checkTable(table)
    })
    callback()
  }
}
