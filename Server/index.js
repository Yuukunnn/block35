import express from 'express';
import dotenv from 'dotenv';
import chalk from 'chalk';
import cors from 'cors';
import { createTables, createUser, createProduct, createFavorite, fetchUser, fetchProduct, fetchFavortites, destroyFavorite } from './db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await createTables();
    app.listen(port, () => {
      console.log(chalk.green(`server listening on port ${port} successfully!!`));
    });
  } catch (error) {
    console.log(chalk.red('Error starting the server: '), error);
  }
};

startServer();
