const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

const Departments = require('./lib/Departments.js');
const Roles = require('./lib/Roles.js');
const Employees = require('./lib/Employees.js');

const mainMenuQuestion = [
  {type: 'list',
  name: 'startQuestion',
  message: 'What would you like to do?',
  choices: ['View Departments','View Roles', 'View Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update a Role']
   }];

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'password',
    database: 'employees'
  },
  console.log('Connected to the employee database.')
);

app.get('/', (req, res) => {
    res.json({
      message: 'Hello World'
    });
  });

app.use((req, res) => {
    res.status(404).end();
  });

displayDepartments = function () {
  db.query(`SELECT * FROM departments`, (err, rows) => {
    console.table(rows);
  });
};

displayRoles = function () {
  const sql = `SELECT roles.id, roles.title, roles.salary, departments.department_name
  FROM roles
  INNER JOIN departments ON roles.department_id=departments.id;`;

  db.query(sql, (err, result) => {
  if (err) {
  console.log(err);
  }
console.table(result);
});
};

displayEmployees = function () {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, employees.manager_id
  FROM employees
  LEFT JOIN roles ON employees.role_id=roles.id;`;

  db.query(sql, (err, result) => {
  if (err) {
  console.log(err);
  }
console.table(result);
});
};

mainMenu = function () {
  return inquirer.prompt(mainMenuQuestion)
  .then ((answers) => {
    if (answers.startQuestion === 'View Departments') {
      displayDepartments();
    } else if (answers.startQuestion === 'View Roles') {
      displayRoles();
    } else if (answers.startQuestion === 'View Employees') {
      displayEmployees();
    } else {
      greeting = "Good evening";
    }
  console.log(answers.startQuestion);
})
};

startUp = async function()
{
//Confirms local port
await app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  console.log('this is the Main Menu');
  mainMenu();
}

startUp();