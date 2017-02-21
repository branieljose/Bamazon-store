//get npm packages ready
const mysql = require('mysql');
const inquirer = require('inquirer');

//connects to mysql database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'bamazon_db'
})

//starts connection
connection.connect();

//main function, triggers other function based on user's choice
function startInt() {
    inquirer.prompt([{
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: ['1. View poducts for sale', '2. View low inventory', '3. Add to inventory', '4. Add a new product'],
        filter: function(val) {
            return val.toLowerCase();
        }
    }]).then(function(answers) {
        let command = parseInt(answers.options);
        if (command === 1) {
            viewProducts();
            
        } else if (command === 2) {
            viewLow();
           
        } else if (command === 3) {
            add();
        } else if (command === 4) {
            addNew();
        }

    });
}

startInt();


//Displays all products listed  
function viewProducts() {

    connection.query('SELECT * FROM products', function(error, results, fields) {
        if (error) throw error;
        for (let i = 0; i < results.length; i++) {
            console.log('ID: ' + results[i].id + ' | ' +
                ' MODEL NUMBER: ' + results[i].product_name + ' | ' +
                ' PRICE: ' + results[i].price + ' | ' + ' QUANTITY: ' + results[i].stock_quantity +
                '\n =========================================================== '
            );
        }
    });
   
}

//Displays all products with a stock quantity lower than 5
function viewLow() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 6', function(error, results, fields) {
        for (let i = 0; i < results.length; i++) {
            console.log('ID: ' + results[i].id + ' | ' +
                ' MODEL NUMBER: ' + results[i].product_name + ' | ' +
                ' | ' + ' QUANTITY: ' + results[i].stock_quantity +
                '\n =========================================================== '
            );
        }
    });
}


//Add inventory, allows manager to add more stock to items that already exist
function add() {

    let id = [];
    let currQuan = [];

    inquirer.prompt([{
        type: 'input',
        name: 'id',
        message: 'What\'s the ID of the item you wish add more stock?'
    }]).then(function(data) {
        connection.query('SELECT * FROM products WHERE id =' + data.id, function(error, results, fields) {
            id.push(data.id);
            currQuan.push(results[0].stock_quantity);

            for (let i = 0; i < results.length; i++) {
                console.log(' ===========================================================\n ' + 'ID: ' + results[i].id + ' | ' +
                    ' MODEL NUMBER: ' + results[i].product_name + ' | ' +
                    ' | ' + ' QUANTITY: ' + results[i].stock_quantity +
                    '\n =========================================================== '
                );
            }

            inquirer.prompt([{
                type: 'input',
                name: 'quantity',
                message: 'How many more units would you like to add?'
            }]).then(function(data) {
                let total = parseInt(data.quantity) + parseInt(currQuan[0]);
                connection.query('UPDATE products SET stock_quantity = ' + total + ' WHERE id=' + id[0], function(error, results, fields) {
                    console.log('Quantity has been updated!');
                        });
            });

        });
    });


}
//Adds new item to database
function addNew() {

    let modelNum = [];
    let department = [];
    let price = [];
    let stock = [];

    inquirer.prompt([{
        type: 'input',
        name: 'm',
        message: 'What\'s the new\'s item model number?'
    }]).then(function(data) {
        modelNum.push(data.m);
        inquirer.prompt([{
            type: 'input',
            name: 'd',
            message: 'Which department it belongs to?'
        }]).then(function(data) {
            department.push(data.d);
            inquirer.prompt([{
                type: 'input',
                name: 'p',
                message: 'What\'s the selling price?'
            }]).then(function(data) {
                price.push(data.p);
                inquirer.prompt([{
                    type: 'input',
                    name: 's',
                    message: 'How many units you\'d like to add?'
                }]).then(function(data) {
                    stock.push(data.s);
                    // console.log(modelNum[0].toString());
                    connection.query('INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES (' + modelNum[0].toString() + ',' + department[0] + ',' + price[0] + ',' + stock[0] + ')', function(error, results, fields) {
                        if (error) throw error;
                        console.log('A new item has been added!');
                                })
                });

            });
        });
    });




}

