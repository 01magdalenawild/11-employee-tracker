const mysql = require('mysql2');
const inquirer = require('inquirer');
const prompt =inquirer.createPromptModule();
const mainmenu=()=>{
    prompt(
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
        }
    ).then((answer)=>{
        switch(answer.choice){
            case 'View All Departments':
                viewAllDepartments();
                break;

            case 'View All Roles':
                viewAllRoles();
                break;

            case 'View All Employees':
                viewAllEmployees();
                break;
                default:process.exit();
        }
    })
}
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: process.env.PASSWORD,
      database: 'employee_tracker_db'
    },
    console.log(`employee_tracker_db connected connected`)
  );
  
  function viewAllDepartments() {
    db.promise().query('SELECT * FROM department').then(([rows, fields]) => {
        console.table(rows);
        mainmenu();
      })
  }
  function viewAllRoles() {
    db.promise().query('SELECT * FROM role').then(([rows, fields]) => {
        console.table(rows);
        mainmenu();
        
      })
  }
  function viewAllEmployees() {
    db.promise().query('SELECT * FROM employee').then(([rows, fields]) => {
        console.table(rows);
        mainmenu();
      })
  }
  mainmenu();