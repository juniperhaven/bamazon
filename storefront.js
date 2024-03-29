// to do:
// make the storefront print out nicer
// make all itemDisplay runs after the first one optional, based on an inquirer prompt selection
// remove my SQL password from this before committing to git again.

var mysql = require("mysql");
// I included inquirer for the prompts
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // port, usually 3306
    port: 3306,

    // username, usually root
    user: "root",

    // password for SQL goes here
    password: "",
    database: "bamazon"
});

// make connection
connection.connect(function(err) {
    if (err) throw err;
    itemDisplay();
});

// I made an item display function to show the storefront, because that way if you wanted to see it again you could
// instead of just having to scroll up a bunch always
// also this way if you want to see the updated table, you can
// but it doesn't auto-print out, because I tried that and it just involved way too much scrolling up to see things like the purchase stuff
function itemDisplay() {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err; // error handling

        // I wanted the storefront to look nice, so I logged things to look...nice instead of just like...'row data packet' and whatnot.
        // I also included a separater between items because it was kinda hard to read otherwise.
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: "+res[i].item_id);
            console.log("Product Name: "+res[i].product_name);
            console.log("Department: "+res[i].dept_name);
            console.log("Price: $"+res[i].price);
            console.log("Quantity in Stock: "+res[i].stock_quantity);
            console.log("--------------------------------------------\n");
        }

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
            choices: ["Buy an item", "See item list", "Exit the program"],
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
                    message: "Please enter the item ID of the item you would like to purchase: ",
                    name: "idNum"
                },
                {
                    type: "input",
                    message: "Please enter the number of this item you would like to purchase: ",
                    name: "quantity"
                }
            ]).then(function(inqResponse) {

                // I parsed the id and quantity numbers entered as integers, because I wasn't sure they'd be numbers otherwise
                // and I needed them to be numbers for math, at the very least
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

                        // after that we call storefront again, to start the selection of things over
                        storefront();
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

                            // call storefront to start things over
                            storefront();
                        });
                    }
                });
            });
        }
        else if(inquirerResponse.selection == "See item list") {
            // if you select 'see the item list', it runs the itemDisplay function again, which will then automatically run storefront again.
            itemDisplay();
        }
        else {
            // if you selected 'exit the program', we end the connection and no function is called.
            connection.end();
        }
    });
}