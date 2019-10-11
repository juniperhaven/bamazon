var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // port, usually 3306
    port: 3306,

    // username, usually root
    user: "root",

    // password for SQL
    password: "fuckyou",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    itemDisplay();
});

function itemDisplay() {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;
        console.log(res);
        storefront();
    });
}

function storefront() {
    inquirer.prompt([
    // Here we create a basic text prompt.
        {
            type: "list",
            message: "Please select what you would like to do: ",
            choices: ["Buy an item", "Exit the program"],
            name: "selection"
        }
    ]).then(function(inquirerResponse) {
        if(inquirerResponse.selection == "Buy an item") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter the number ID of the item you would like to purchase: ",
                    name: "idNum"
                },
                {
                    type: "input",
                    message: "Please enter the number of this item you would like to purchase: ",
                    name: "quantity"
                }
            ]).then(function(inqResponse) {

                var id = parseInt(inqResponse.idNum);
                var quant = parseInt(inqResponse.quantity);

                console.log(id);
                console.log(quant);

                connection.query("SELECT stock_quantity FROM products WHERE ?", {item_id: id}, function(err, res) {
                    if (err) throw err;

                    var num = parseInt(res[0].stock_quantity);

                    console.log(num);

                    if(num < quant) {
                        console.log("Insufficient quantity! Order not placed.");
                        itemDisplay();
                    }
                    else {
                        num = num-quant;

                        console.log(num);
                        connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: num}, {item_id: id}], function(err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " products updated! Order successfully placed!\n");
                            itemDisplay();
                        });
                    }
                });
            });
        }
        else {
            connection.end();
        }
    });
}