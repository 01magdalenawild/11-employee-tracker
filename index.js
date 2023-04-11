const mysql = require('mysql2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
require('dotenv').config();
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: process.env.DB_PASSWORD,
        database: 'employee_tracker_db'
    },
    console.log(`employee_tracker_db connected connected`)
);
const mainmenu = () => {
    prompt(
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role',"exit"]
        }
    ).then((answer) => {
        switch (answer.choice) {
            case 'View All Departments':
                viewAllDepartments();
                break;

            case 'View All Roles':
                viewAllRoles();
                break;

            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            default: process.exit();
        }
    })
}


function viewAllDepartments() {
    db.promise().query('SELECT * FROM department').then(([rows, fields]) => {
        console.table(rows);
        mainmenu();
    })
}

function addDepartment() {
    prompt(
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department you would like to add?'
        }
    ).then((answer) => {
        db.promise().query('INSERT INTO department SET?', { department_name: answer.name }).then(([rows, fields]) => {
            if (rows.affectedRows > 0) {
                console.log(`Added ${answer.name}`);
                viewAllDepartments()
            } else {
                console.log(`Failed to add ${answer.name}`);
                mainmenu();
            }

        })
    })
}
function viewAllRoles() {
    db.promise().query('SELECT * FROM role').then(([rows, fields]) => {
        console.table(rows);
        mainmenu();

    })
}
async function addRole() {
    const [departments] = await db.promise().query('SELECT * FROM department');
    const departmentChoices = departments.map(({ id, department_name }) => ({
        name: department_name,
        value: id
    }))
    console.log(departmentChoices);
    prompt(
        [
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the role you would like to add?'
            }, {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role you would like to add?'
            }, {
                type: 'list',
                name: 'department_id',
                message: 'What department does this role belong to?',
                choices: departmentChoices
            }
        ]
    ).then(({ title, salary, department_id }) => {
        db.promise().query('INSERT INTO role SET?', { title, salary, department_id }).then(([rows, fields]) => {
            if (rows.affectedRows > 0) {
                console.log(`Added ${title}`);
                viewAllRoles()
            } else {
                console.log(`Failed to add ${title}`);
                mainmenu();
            }
        })
    })
}
function viewAllEmployees() {
    db.promise().query('SELECT * FROM employee').then(([rows, fields]) => {
        console.table(rows);
        mainmenu();
    })
}
async function addEmployee() {
    const [roles] = await db.promise().query('SELECT * FROM role');
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }))
    const [employees] = await db.promise().query('SELECT * FROM employee');
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }))
    prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee you would like to add?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee you would like to add?'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What role does this employee have?',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Who is the employee\'s manager?',
            choices: employeeChoices
        }
    ]).then(({ first_name, last_name, role_id, manager_id }) => {
        db.promise().query('INSERT INTO employee SET?', { first_name, last_name, role_id, manager_id }).then(([rows, fields]) => {
            if (rows.affectedRows > 0) {
                console.log(`Added ${first_name} ${last_name}`);
                viewAllEmployees()

            } else {
                console.log(`Failed to add ${first_name} ${last_name}`);
                mainmenu();
            }
        })
    })
}
async function updateEmployeeRole() {
    const [employees] = await db.promise().query('SELECT * FROM employee');
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }))
    const [roles] = await db.promise().query('SELECT * FROM role');
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }))
    prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee would you like to update?',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the new role for this employee?',
            choices: roleChoices
        },
    ]).then(({ employee_id, role_id }) => {
        db.promise().query('UPDATE employee SET role_id =? WHERE id =?', [role_id, employee_id]).then(([rows, fields]) => {
            if (rows.affectedRows > 0) {

                viewAllEmployees()
            } else {
                console.log("failed to update employee role");
            }
        })
    })

}

mainmenu();