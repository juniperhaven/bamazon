var mysql = require("mysql");
// I included inquirer for the prompts
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

// make connection
connection.connect(function(err) {
    if (err) throw err;
    itemDisplay();
});

// I made an item display function to show the storefront, because that way I could show it again after someone made a purchase
// you have to scroll up to see your purchase, but at least this way I know that the updating worked, so
function itemDisplay() {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err; // error handling
        console.log(res);

        // after console logging the results, go to the storefront function
        storefront();
    });
}

// this function handles all of the purchasing and updating stuff
function storefront() {
    // I started with an inquirer prompt that asks what you want to do
    // if you select buy an item it goes through the program
    // if you select exit the program, the connection ends and no functions are called
    inquirer.prompt([
        {
            type: "list",
            message: "Please select what you would like to do: ",
            choices: ["Buy an item", "Exit the program"],
            name: "selection"
        }
    ]).then(function(inquirerResponse) {
        // if the response is 'buy an item'
        // there's a new inquirer prompt
        // it asks you for the id number of the item you want and the quantity you'd like to purchase
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

                // I parsed the id and quantity numbers entered as integers, because I wasn't sure they'd be numbers otherwise
                // and I needed them to be numbers for math and also possibly for accessing the table
                // I wasn't sure so I just did it.
                var id = parseInt(inqResponse.idNum);
                var quant = parseInt(inqResponse.quantity);

                // gets the selected item's stock quantity
                connection.query("SELECT stock_quantity FROM products WHERE ?", {item_id: id}, function(err, res) {
                    if (err) throw err; // error handling

                    // parse stock quantity as a number, for math
                    var num = parseInt(res[0].stock_quantity);

                    // if you're trying to buy more of the item than is in stock, you will be told there is insufficient quantity and the order wasn't placed
                    if(num < quant) {
                        console.log("Insufficient quantity! Order not placed.");

                        // after that we call itemDisplay again, to start things over
                        itemDisplay();
                    }
                    else {
                        // if there is enough of the thing you wanted to buy, I subtract the number you're purchasing from the existing quantity
                        num = num-quant;

                        // then the table in SQL is updated to the new quantity after purchase
                        connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: num}, {item_id: id}], function(err, res) {
                            if (err) throw err; // error handling

                            // console log that the product was updated and the order was successfully placed
                            // it just logs '1 product updated, because you can only ever purchase one thing at a time, but I didn't know what else to do really
                            console.log(res.affectedRows + " product updated! Order successfully placed!\n");

                            // call itemDisplay to start things over
                            itemDisplay();
                        });
                    }
                });
            });
        }
        else {
            // if you selected 'exit the program', we end the connection and no function is called.
            connection.end();
        }
    });
}