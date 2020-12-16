module.exports = {
  all:
        "SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, CONCAT(m.first_name,' ',m.last_name) AS Manager, role.salary AS Salary " +
        "FROM employee e " +
        "INNER JOIN role ON e.role_id = role.id " +
        "INNER JOIN department ON role.department_id = department.id " +
        "LEFT JOIN employee m ON e.manager_id = m.id ",
  deptBudget:
        "SELECT department.name, SUM(role.salary) AS utilizedBudget " +
        "FROM employee " +
        "INNER JOIN role ON employee.role_id = role.id " +
        "INNER JOIN department ON role.department_id = department.id " +
        "WHERE department.name = ? "
}
