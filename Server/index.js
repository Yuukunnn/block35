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
    console.log(chalk.red('An error occurs while starting the server: '), error);
  }
};

startServer();

app.get('/api/users', async (req, res) => {
  try {
    const users = await fetchUser();
    res.send(users);
  } catch (error) {
    console.log(chalk.red(error));
    res.status(404).send('An error occurs while fetching users');
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await fetchProduct();
    res.send(products);
  } catch (error) {
    console.log(chalk.red(error));
    res.status(404).send('An error occurs while fetching products');
  }
});

app.get('/api/users/:id/favorites', async (req, res) => {
  try {
    const favorites = await fetchFavortites(req.params.id);
    res.send(favorites);
  } catch (error) {
    console.log(chalk.red(error));
    res.status(404).send('An error occurs while fetching favorites');
  }
});

app.post('/api/users/username', async (req, res) => {
  try {
    const { username, password } = req.body;
    const addUsers = await createUser(username, password);
    res.status(201).send(addUsers);
  } catch (error) {
    console.log(chalk.red(error));
    res.status(404).send('An error occurs while adding a user');
  }
});

app.post('/api/product/name', async (req, res) => {
  try {
    const { name } = req.body;
    const addProduct = await createProduct(name);
    res.status(201).send(addProduct);
  } catch (error) {
    console.log(chalk.red(error));
    res.status(404).send('An error occurs while adding a product');
  }
});

app.post('/api/users/:id/favorites', async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.params.id;
    const addFavorite = await createFavorite(product_id, user_id);
    res.status(201).send(addFavorite);
  } catch (error) {
    console.log(chalk.red(error));
    res.status(500).send('An error occurs while adding a favorite');
  }
});

app.delete('/api/users/:userId/favorites/:id', async (req, res) => {
  try {
    const favoriteId = req.params.id;
    const userId = req.params.userId;
    const deleteFavorite = await destroyFavorite(userId, favoriteId);
    res.status(204).send();
  } catch (error) {
    console.log(chalk.red(error));
    res.status(404).send('An error occurs while deleting a favorite');
  }
});
