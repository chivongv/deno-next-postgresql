import { Client } from "../../deps.ts";
import { dbCredentials } from "../config/dbCredentials.ts";

const client = new Client(dbCredentials);

try {
  await client.connect();
  console.log("Database is connected");
  const dropTable = await client.queryArray(
    `DROP TABLE IF EXISTS products;`,
  );
  const createTable = await client.queryArray(
    `CREATE TABLE IF NOT EXISTS products(
      id SERIAL PRIMARY KEY, 
      name VARCHAR(50) NOT NULL, 
      description VARCHAR(255) NOT NULL, 
      price NUMERIC NOT NULL, 
      currency VARCHAR(10) NOT NULL);`,
  );
  const populateSampleData = await client.queryArray(`INSERT INTO products
  (name, description, price, currency) 
  VALUES ('Product 1', 'Product 1', 99, 'SEK'), 
  ('Product 2', 'Product 2', 250, 'SEK'), 
  ('Product 3', 'Product 3', 19.95, 'SEK');`);
  // const products = await client.queryArray(`SELECT * FROM products;`);
} catch (err) {
  console.log("Error! Was not able to connect to database.", err);
}

export { client };
