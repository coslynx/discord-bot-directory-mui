const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


const getAllBots = async (req, res) => {
  try {
    const { query } = req.query;
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
    res.json(bots);
  } catch (error) {
    console.error('Error fetching bots:', error);
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
};

const getBotById = async (req, res) => {
  try {
    const botId = req.params.botId;
    const client = await pool.connect();
    const result = await client.query(
      'SELECT , (SELECT AVG(rating) FROM reviews WHERE bot_id = $1) AS average_rating, (SELECT COUNT() FROM reviews WHERE bot_id = $1) AS review_count FROM bots WHERE id = $1',
      [botId]
    );
    const bot = result.rows[0];
    client.release();
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    res.json(bot);
  } catch (error) {
    console.error('Error fetching bot:', error);
    res.status(500).json({ error: 'Failed to fetch bot' });
  }
};

const createBot = async (req, res) => {
  try {
    const { name, description, inviteLink, imageUrl, category, repositoryLink, ownerId } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO bots (name, description, invite_link, image_url, category_id, repository_link, owner_id, approved) VALUES ($1, $2, $3, $4, $5, $6, $7, false) RETURNING ',
      [name, description, inviteLink, imageUrl, category, repositoryLink, ownerId]
    );
    const newBot = result.rows[0];
    client.release();
    res.status(201).json(newBot);
  } catch (error) {
    console.error('Error creating bot:', error);
    res.status(500).json({ error: 'Failed to create bot' });
  }
};

const updateBot = async (req, res) => {
  try {
    const botId = req.params.botId;
    const { name, description, inviteLink, imageUrl, category, repositoryLink } = req.body;
    const client = await pool.connect();
    await client.query(
      'UPDATE bots SET name = $1, description = $2, invite_link = $3, image_url = $4, category_id = $5, repository_link = $6 WHERE id = $7',
      [name, description, inviteLink, imageUrl, category, repositoryLink, botId]
    );
    client.release();
    res.json({ message: 'Bot updated successfully' });
  } catch (error) {
    console.error('Error updating bot:', error);
    res.status(500).json({ error: 'Failed to update bot' });
  }
};

const deleteBot = async (req, res) => {
  try {
    const botId = req.params.botId;
    const client = await pool.connect();
    await client.query('DELETE FROM bots WHERE id = $1', [botId]);
    client.release();
    res.json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    res.status(500).json({ error: 'Failed to delete bot' });
  }
};

const approveBot = async (req, res) => {
  try {
    const botId = req.params.botId;
    const client = await pool.connect();
    await client.query('UPDATE bots SET approved = true WHERE id = $1', [botId]);
    client.release();
    res.json({ message: 'Bot approved successfully' });
  } catch (error) {
    console.error('Error approving bot:', error);
    res.status(500).json({ error: 'Failed to approve bot' });
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