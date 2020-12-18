# EIS :) Employee Management System 👻👻👻
An easy to use interaction with MySQL database to manage employee names, roles, departments, managers, and salaries.

## 🚀 Installation
* `cd` into your desired directory
* `git clone https://github.com/nickgraffis/employee-management-system.git`
* `npm install`
* Edit your .env.EXAMPLE file to depict your desired MySQL credentials, and remove the .EXAMPLE extension
* `npm run go`

## Useage
When you start the app, it will first check your database to see if the proper tables are inside, and then create them if they are not.

Once the database is partitioned properly you will be prompted a list of options. Follow along to perform your desired tasks.

Here is a list of options:

```javascript
choices: [
  "View All Employees",
  "View Employees by Department",
  "View Employees by Role",
  "View Employees by Manager",
  "Add a Department",
  "Remove a Department",
  "Add a Role",
  "Remove a Role",
  "Add an Employee",
  "Remove an Employee",
  "Update an Employee's Role",
  "Update an Employee's Manager",
  "View Utilized Budget by Department",
  "^C (EXIT)"
]
```

## 📺 Demos

### Creating from scratch
<img src="assets/demo_from_start.gif" />

### Tooling around
<img src="assets/demo_from_seeds.gif" />

## Common errors
Error handling tries to provide something as helpful as possible. The biggest error by far is <strong> not properly updating your .env file</strong>!

## 🤓 Geeking out! How it all works!
Basic structure to interact with the database using mysql npm package.
#### We have the run command
`now.run(query, selectors, log, table)` -> returns a promise resolved with the response of the mysql query.

#### We have the query command
`query.by('department')` -> returns a string of SQL text

#### We have the select command
`select.just(role)` -> returns the specified selectors in an array

#### Optionally Log and Table
We can add a log to be printed out, and specify weather or not a table of the response data should be printed out

When you ask to "View all Employees By Role" we execute
```javascript
now.run(query.by('role.title'), select.just(role)).then((res) => openMenu())
```
I used an async forEach loop in a couple places here. I wrote this article about how that works: [async / await in forEach loop 🤯](https://nicholasgraffis.medium.com/async-await-in-foreach-loop-cb6e0aaadb34)
