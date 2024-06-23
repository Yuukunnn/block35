import pg from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';
import bcrypt from 'bcrypt';

dotenv.config();

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/Acme_Store');

const createTables = async () => {
  await client.connect();
  const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  DROP TABLE IF EXISTS Favorites;
  DROP TABLE IF EXISTS Users;
  DROP TABLE IF EXISTS Products;

  CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  );

  CREATE TABLE Products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL
  );

  CREATE TABLE Favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES Products(id) NOT NULL,
    user_id UUID REFERENCES Users(id) NOT NULL,
    CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
  )
  `;

  await client.query(SQL);
  console.log(chalk.green('database built successfully'));
};

const createUser = async (username, password) => {
  const ecryptPassword = async (password) => {
    try {
      const hash = await bcrypt.hash(password, 10);
      return hash;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  try {
    const hashedPassword = await ecryptPassword(password);
    const SQL = `
    INSERT INTO Users(username, password)
    VALUES ('${username}', '${hashedPassword}')
    RETURNING *
    `;
    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const createProduct = async (name) => {
  const SQL = `
      INSERT INTO Products(name)
      VALUES ('${name}')
      RETURNING *
      `;
  try {
    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const createFavorite = async (product_id, user_id) => {
  const SQL = `
      INSERT INTO Favorites(product_id, user_id)
      VALUES ('${product_id}', '${user_id}')
      RETURNING *
      `;
  try {
    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const fetchUser = async () => {
  const SQL = `
    SELECT * FROM Users
    `;
  try {
    const response = await client.query(SQL);
    return response.rows;
  } catch {
    console.log(chalk.red(error));
    throw error;
  }
};

const fetchProduct = async () => {
  const SQL = `
      SELECT * FROM Products
      `;
  try {
    const response = await client.query(SQL);
    return response.rows;
  } catch {
    console.log(chalk.red(error));
    throw error;
  }
};

const fetchFavortites = async (user_id) => {
  const SQL = `
      SELECT * FROM Favorites 
      WHERE user_id = '${user_id}'
      `;
  try {
    const response = await client.query(SQL);
    return response.rows;
  } catch {
    console.log(chalk.red(error));
    throw error;
  }
};

const destroyFavorite = async (user_id, favorite_id) => {
  const SQL = `
    DELETE FROM Favorites
    WHERE id = '${favorite_id}' AND user_id= '${user_id}'  
    `;
  const response = await client.query(SQL);
  return response.rows;
};

export { client, createTables, createUser, createProduct, createFavorite, fetchUser, fetchProduct, fetchFavortites, destroyFavorite };
