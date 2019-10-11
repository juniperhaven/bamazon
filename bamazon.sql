DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR (100),
    dept_name VARCHAR (100),
    price DECIMAL (10, 4),
    stock_quantity INT (100),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("cat food bowl", "pet", 10.50, 10), ("wall mirrors", "home decoration", 15.00, 50), 
("cell phone case", "electronics", 11.00, 7), ("computer mouse", "electronics", 7, 20),
("cat toy", "pet", 15.75, 15), ("fridge magnet", "home decoration", 5.50, 40),
("sunglasses", "accessories", 30.00, 25), ("set of 10 paintbrushes", "art", 35.00, 15),
("purple hair dye", "beauty & personal care", 15.00, 15), ("office chair", "office products", 60.75, 30),
("window curtains", "home decoration", 20.50, 10);