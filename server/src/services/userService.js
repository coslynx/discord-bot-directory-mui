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

const registerUser = async (userData) => {
  try {
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING ',
      [username, email, hashedPassword]
    );
    const newUser = result.rows[0];
    client.release();
    return newUser;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
};


const loginUser = async (credentials) => {
  try {
    const { email, password } = credentials;
    const client = await pool.connect();
    const result = await client.query('SELECT  FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    client.release();
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id, isAdmin: user.is_admin }, process.env.JWT_SECRET);
    return { token, userId: user.id, isAdmin: user.is_admin, username: user.username, email: user.email };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error('Failed to log in user');
  }
};

const getUserById = async (userId) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT  FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    client.release();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Failed to get user');
  }
};

const updateUser = async (userId, userData) => {
  try {
    const { username, email, password } = userData;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const client = await pool.connect();
    await client.query(
      'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4',
      [username, email, hashedPassword || null, userId]
    );
    client.release();
    return { message: 'User updated successfully' };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};


const addToFavorites = async (userId, botId) => {
  try {
    const client = await pool.connect();
    await client.query('INSERT INTO user_favorites (user_id, bot_id) VALUES ($1, $2)', [userId, botId]);
    client.release();
    return { message: 'Bot added to favorites' };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw new Error('Failed to add bot to favorites');
  }
};

const removeFromFavorites = async (userId, botId) => {
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM user_favorites WHERE user_id = $1 AND bot_id = $2', [userId, botId]);
    client.release();
    return { message: 'Bot removed from favorites' };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw new Error('Failed to remove bot from favorites');
  }
};


const getUserFavorites = async (userId) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT b. FROM user_favorites uf JOIN bots b ON uf.bot_id = b.id WHERE uf.user_id = $1`,
      [userId]
    );
    const favorites = result.rows;
    client.release();
    return favorites;
  } catch (error) {
    console.error('Error getting user favorites:', error);
    throw new Error('Failed to get user favorites');
  }
};

const updateBanStatus = async (userId, banned) => {
    try {
        const client = await pool.connect();
        await client.query('UPDATE users SET banned = $1 WHERE id = $2', [banned, userId]);
        client.release();
        return { message: 'User ban status updated successfully' };
    } catch (error) {
        console.error('Error updating user ban status:', error);
        throw new Error('Failed to update user ban status');
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
  updateBanStatus
};
```