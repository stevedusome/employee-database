const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

const Departments = require('./lib/Departments.js');
const Roles = require('./lib/Roles.js');
const Employees = require('./lib/Employees.js');

let allEmployees = [];
let allRoles = [];

const mainMenuQuestion = [
  {type: 'list',
  name: 'startQuestion',
  message: 'What would you like to do?',
  choices: ['View Departments','View Roles', 'View Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
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

displayDepartments = function () {
  db.query(`SELECT * FROM departments`, (err, rows) => {
    console.table("\n",rows,"\n");
    return true;
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
return console.table("\n",result,"\n");
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
return console.table("\n",result,"\n");
});
};

addDepartment = async function () {
  const questions = [
    {
      type: 'text',
      name: 'departmentName',
      message: "What is the name of the new Department?",
      validate: departmentNameInput => {
          if (departmentNameInput) {
              return true;
          }
          else {
              console.log("Please enter name of your department");
              return false;
          }}
    } ];

    return inquirer.prompt(questions)
    .then((answers) => {
      const name = answers.departmentName;
      const sql = `INSERT INTO departments (department_name) 
              VALUES (?)`;

              db.query(sql, name, (err, result) => {
                if (err) {
                  console.log(err);
                }
                return console.log("Department saved");
              });
            })
};

addRole = async function () {
  
  let currentDepartments = []
  db.query(`SELECT * FROM departments`, (err, rows) => {
    
    for (let i = 0; i < rows.length; i++) {
    let thisDepartment = `${rows[i].id}. ${rows[i].department_name}`;
    currentDepartments.push(thisDepartment);
    };

  });

  const questions = [
    {
      type: 'text',
      name: 'roleTitle',
      message: "What is the title of the new Role?",
      validate: roleTitleInput => {
          if (roleTitleInput) {
              return true;
          }
          else {
              console.log("Please enter the title of the role");
              return false;
          }}
    },
    {
      type: 'number',
      name: 'roleSalary',
      message: "What is the salary of the new Role?",
      validate: roleSalaryInput => {
          if (roleSalaryInput) {
              return true;
          }
          else {
              console.log("Please enter salary of the role");
              return false;
          }}
    },
    {
      type: 'list',
      name: 'roleDepartment',
      message: 'Which department does the role belong to?',
      choices: currentDepartments
     }
  ];    

  return inquirer.prompt(questions)
    .then((answers) => {
      const departmentNumber = answers.roleDepartment.match(/(\d+)/);;
      const params = [answers.roleTitle, answers.roleSalary, departmentNumber[0]];
      const sql = `INSERT INTO roles (title, salary, department_id) 
              VALUES (?,?,?)`;

              db.query(sql, params, (err, result) => {
                if (err) {
                  console.log(err);
                }
                return console.log("Role saved");
              });
})
};

addEmployee = async function () {

  allEmployees.push('None')

  const questions = [
    {
      type: 'text',
      name: 'firstName',
      message: "What is the employees first name?",
      validate: firstNameInput => {
          if (firstNameInput) {
              return true;
          }
          else {
              console.log("Please enter the first name");
              return false;
          }}
    },
    {
      type: 'text',
      name: 'lastName',
      message: "What is the employees last name?",
      validate: lastNameInput => {
          if (lastNameInput) {
              return true;
          }
          else {
              console.log("Please enter the last name");
              return false;
          }}
    },
    {
      type: 'list',
      name: 'employeeRole',
      message: 'What is the employees role?',
      choices: allRoles
     },
     {
      type: 'list',
      name: 'employeeManager',
      message: 'Who is the employees manager?',
      choices: allEmployees
     }
  ];    

  return inquirer.prompt(questions)
    .then((answers) => {
      let managerNumber
      if (answers.employeeManager === 'None') {
        managerNumber = NULL;
      } else {
        managerNumber = answers.employeeManager.match(/(\d+)/);;
      }
      
      const roleNumber = answers.employeeRole.match(/(\d+)/);;
      const params = [answers.firstName, answers.lastName, roleNumber[0], managerNumber[0]];
      const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
              VALUES (?,?,?,?)`;

              db.query(sql, params, (err, result) => {
                if (err) {
                  console.log(err);
                }
                return console.log("Employee saved");
              });
})
};

updateRole = async function () {

 const questions = [{
    type: 'list',
    name: 'whichEmployee',
    message: 'Which employee is changing roles??',
    choices: allEmployees
   },
   {
    type: 'list',
    name: 'newRole',
    message: 'What is their new role?',
    choices: allRoles
   }
];

return inquirer.prompt(questions)
.then ((answers) => {

  const updatedEmployee = answers.whichEmployee.match(/(\d+)/);
  const updatedRole = answers.newRole.match(/(\d+)/);
  const params = [updatedRole[0], updatedEmployee[0]]
  const sql = `UPDATE employees
  SET role_id = ?
  WHERE id = ?`

  db.query(sql, params, (err, result) => {
    if (err) {
    console.log(err);
    }
  return console.log("Employee Role updated");
  });

});



}

mainMenu = async function () {
  db.execute(`SELECT * FROM employees`, (err, rows) => {
       
    for (let i = 0; i < rows.length; i++) {
    let thisEmployee = `${rows[i].id}. ${rows[i].first_name} ${rows[i].last_name}`;
    allEmployees.push(thisEmployee);
    if (!allEmployees.includes(thisEmployee)) {
      allEmployees.push(thisEmployee);
    }
    };
  });

  db.execute(`SELECT * FROM roles`, (err, rows) => {
      
    for (let i = 0; i < rows.length; i++) {
    let thisRole = `${rows[i].id}. ${rows[i].title}`;
    if (!allRoles.includes(thisRole)) {
      allRoles.push(thisRole);
    }};
  });;
  return inquirer.prompt(mainMenuQuestion)
  .then ((answers) => {

    if (answers.startQuestion === 'View Departments') {

        return displayDepartments();

    } else if (answers.startQuestion === 'View Roles') {

      return displayRoles();

    } else if (answers.startQuestion === 'View Employees') {

      return displayEmployees();

    } else if (answers.startQuestion === 'Add a Department') {

      return addDepartment();

    } else if (answers.startQuestion === 'Add a Role') {

      return addRole();

    } else if (answers.startQuestion === 'Add an Employee') {

      return addEmployee();

    } else {

      return updateRole();
    }
  console.log(answers.startQuestion);
})
};

mainMenuLoop = async function() {
  while (true === true) {
  await mainMenu();;
}
};

startUp = async function()
{
//Confirms local port
await app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  console.log('this is the Main Menu');

  return mainMenuLoop();
}

startUp();