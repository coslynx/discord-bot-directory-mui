const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING ',
      [username, email, hashedPassword]
    );
    const newUser = result.rows[0];
    client.release();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await pool.connect();
    const result = await client.query('SELECT  FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    client.release();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, isAdmin: user.is_admin }, process.env.JWT_SECRET);
    res.json({ token, userId: user.id, isAdmin: user.is_admin, username: user.username, email: user.email });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in user' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const client = await pool.connect();
    const result = await client.query('SELECT  FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    client.release();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const client = await pool.connect();
    await client.query(
      'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4',
      [username, email, hashedPassword || null, userId]
    );
    client.release();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};


const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const botId = req.params.botId;
    const client = await pool.connect();
    await client.query('INSERT INTO user_favorites (user_id, bot_id) VALUES ($1, $2)', [userId, botId]);
    client.release();
    res.json({ message: 'Bot added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Failed to add bot to favorites' });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const botId = req.params.botId;
    const client = await pool.connect();
    await client.query('DELETE FROM user_favorites WHERE user_id = $1 AND bot_id = $2', [userId, botId]);
    client.release();
    res.json({ message: 'Bot removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove bot from favorites' });
  }
};


const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const client = await pool.connect();
    const result = await client.query(
      `SELECT b. FROM user_favorites uf JOIN bots b ON uf.bot_id = b.id WHERE uf.user_id = $1`,
      [userId]
    );
    const favorites = result.rows;
    client.release();
    res.json(favorites);
  } catch (error) {
    console.error('Error getting user favorites:', error);
    res.status(500).json({ error: 'Failed to get user favorites' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
};
```