////get npm packages ready
const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'bamazon_db'
});
//starts connection
connection.connect();


function showItems() {

    connection.query('SELECT * FROM products', function(err, results, fields) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            console.log('ID: ' + results[i].id + ' | ' +
                ' MODEL NUMBER: ' + results[i].product_name + ' | ' +
                ' PRICE: ' + results[i].price +
                '\n ========================================= '
            );


        }

        let id = [];
        let quantity = [];
        let price = [];
        let custQuan = [];

        inquirer.prompt([{
            type: "input",
            name: "id",
            message: 'Welcome to Bamazon industrial!' + '\n' + "What's the id of the item you wish to buy?"
        }]).then(function(data) {
            connection.query('SELECT * FROM products WHERE id =' + data.id, function(error, results, fields) {
                if (error) throw error;
                id.push(data.id);
                quantity.push(results[0].stock_quantity);
                price.push(results[0].price);


            })
            inquirer.prompt([{
                type: "input",
                name: "quantity",
                message: 'How many units would you like to purchase?'
            }]).then(function(data) {

                custQuan.push(data.quantity);

                if (data.quantity > quantity[0]) {
                    console.log('Insufficient quantity!' + '\n' + 'We only have ' + quantity[0] + ' units in stock'), goBack();
                } else {
                    finishTask();
                }


                function finishTask() {


                    let remaining = quantity[0] - data.quantity;

                    connection.query('UPDATE products SET stock_quantity = ' + remaining + ' WHERE id = ' + id[0], function(error, results, fields) {

                        if (error) throw error;

                        let total = custQuan[0] * price[0];

                        console.log('TOTAL: ' + '$' + total);
                    });



                    connection.query('INSERT INTO sales (product_id, quantity_purchased) VALUES (' + id[0] + ', ' + custQuan[0] + ')', function(error, results, fields) {
                        if (error) throw error;
                        connection.end();

                    });


                }

                function goBack() {
                    inquirer.prompt([{
                        type: "confirm",
                        name: "yn",
                        message: 'Would you like to go back?',
                        choices: ["Choice A", new inquirer.Separator(), "choice B"]

                    }]).then(function(data) {
                        if (data.yn == true) {
                            showItems();
                        } else {
                            console.log('Bye Bye, Come back soon!'), connection.end();
                        }
                    });

                }
            });



        });
    });

}


showItems();