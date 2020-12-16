module.exports = {
  run: function (query, selector, log) {
    connection.query(query, selector, (err, res) => {
      if (err) console.log(chalk.red('\n'+err.sqlMessage))
      else {
        if (res.length) console.table(res)
        if (log) console.log(chalk.green('\n'+log))
      }
    })
  }
}
