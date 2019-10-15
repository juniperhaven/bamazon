# bamazon
Bamazon is an application that uses MySQL to store information about a fake storefront database, print out that storefront's items with their price and stock quantity, and then lets you purchase those items as long as the quantity you're attempting to purchase is in stock.

## Installation
Using Git Bash or Terminal, clone the code on to your computer using ```https://github.com/juniperhaven/bamazon.git```. Navigate to the folder you downloaded the program to in Git Bash or Terminal and install the required Node packages by typing ```npm install``` in the console, then put your SQL password into the storefront.js file where it says "password" in the connection variable. Next, open the bamazon.sql file and run it to create the database. At this point you can run the storefront.js file by putting ```node storefront.js``` into the Git Bash or Terminal console.

## Usage
On being first run, the program will print out the list of items in the storefront with their item ID, item name, item department, price, and the quantity of the item in stock. There are 11 items in the storefront.
After this is finished, a prompt will ask you to select one of three options, as seen here:
![initial-prompt](https://i.imgur.com/MN96FOH.png)

Selecting the 'buy an item option' will prompt the program to ask you to enter the item ID first, and then the number of the item you'd like to purchase:
![buy-item](https://i.imgur.com/0HoXc2i.png)

If your order can be placed, you will be told 1 product was updated. Entering a quantity that exceeds the number currently in stock, however, will cause the program to tell you that the order could not be placed, as seen here, where I attempted to purchase 20 window curtains when only 10 are in stock:
![quantity-exceeded](https://i.imgur.com/3Oq0ouP.png)

Entering letters when prompted for the item ID or item quantity will cause the program to break, as will entering 0, any number above 11, or any decimal number that starts with 0 or any number above 11; however, decimal numbers beginning with 1-11 can be successfully entered as the program will simply round down so it's parse as a whole number, as seen here:
![float](https://i.imgur.com/VqBQgcN.png)

After each purchase, you will be brought back to the three options "buy an item", "see item list", and "exit program".
Selecting 'see item list' will print the item list out again, as seen here (only part of the item list can be seen, I couldn't screenshot the entire thing):
![item-list](https://i.imgur.com/VCZaxB0.png)

Selecting 'exit the program' will immediately end the program running.

## Technologies Used
MySQL
Inquirer