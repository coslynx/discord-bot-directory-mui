const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getAllBots = async (query) => {
  try {
    const client = await pool.connect();
    let sql = 'SELECT  FROM bots';
    const params = [];
    if (query) {
      sql += ' WHERE name ILIKE $1 OR description ILIKE $1';
      params.push(`%${query}%`);
    }
    const result = await client.query(sql, params);
    const bots = result.rows;
    client.release();
    return bots;
  } catch (error) {
    console.error('Error fetching bots:', error);
    throw new Error('Failed to fetch bots');
  }
};

const getBotById = async (botId) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT , (SELECT AVG(rating) FROM reviews WHERE bot_id = $1) AS average_rating, (SELECT COUNT() FROM reviews WHERE bot_id = $1) AS review_count FROM bots WHERE id = $1',
      [botId]
    );
    const bot = result.rows[0];
    client.release();
    if (!bot) {
      throw new Error('Bot not found');
    }
    return bot;
  } catch (error) {
    console.error('Error fetching bot:', error);
    throw new Error('Failed to fetch bot');
  }
};

const createBot = async (botData) => {
  try {
    const { name, description, inviteLink, imageUrl, category, repositoryLink, ownerId } = botData;
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO bots (name, description, invite_link, image_url, category_id, repository_link, owner_id, approved) VALUES ($1, $2, $3, $4, $5, $6, $7, false) RETURNING ',
      [name, description, inviteLink, imageUrl, category, repositoryLink, ownerId]
    );
    const newBot = result.rows[0];
    client.release();
    return newBot;
  } catch (error) {
    console.error('Error creating bot:', error);
    throw new Error('Failed to create bot');
  }
};

const updateBot = async (botId, botData) => {
  try {
    const { name, description, inviteLink, imageUrl, category, repositoryLink } = botData;
    const client = await pool.connect();
    await client.query(
      'UPDATE bots SET name = $1, description = $2, invite_link = $3, image_url = $4, category_id = $5, repository_link = $6 WHERE id = $7',
      [name, description, inviteLink, imageUrl, category, repositoryLink, botId]
    );
    client.release();
    return { message: 'Bot updated successfully' };
  } catch (error) {
    console.error('Error updating bot:', error);
    throw new Error('Failed to update bot');
  }
};

const deleteBot = async (botId) => {
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM bots WHERE id = $1', [botId]);
    client.release();
    return { message: 'Bot deleted successfully' };
  } catch (error) {
    console.error('Error deleting bot:', error);
    throw new Error('Failed to delete bot');
  }
};

const approveBot = async (botId) => {
  try {
    const client = await pool.connect();
    await client.query('UPDATE bots SET approved = true WHERE id = $1', [botId]);
    client.release();
    return { message: 'Bot approved successfully' };
  } catch (error) {
    console.error('Error approving bot:', error);
    throw new Error('Failed to approve bot');
  }
};

module.exports = {
  getAllBots,
  getBotById,
  createBot,
  updateBot,
  deleteBot,
  approveBot,
};
```