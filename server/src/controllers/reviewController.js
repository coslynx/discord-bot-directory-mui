const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createReview = async (req, res) => {
  try {
    const { botId, comment, rating, userId } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO reviews (bot_id, comment, rating, user_id) VALUES ($1, $2, $3, $4) RETURNING ',
      [botId, comment, rating, userId]
    );
    const newReview = result.rows[0];
    res.status(201).json(newReview);
    client.release();
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

const getReviewsByBotId = async (req, res) => {
  try {
    const botId = req.params.botId;
    const client = await pool.connect();
    const result = await client.query(
      'SELECT r., u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE bot_id = $1',
      [botId]
    );
    const reviews = result.rows;
    res.json(reviews);
    client.release();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};


const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { comment, rating } = req.body;
    const client = await pool.connect();
    await client.query(
      'UPDATE reviews SET comment = $1, rating = $2 WHERE id = $3',
      [comment, rating, reviewId]
    );
    res.json({ message: 'Review updated successfully' });
    client.release();
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const client = await pool.connect();
    await client.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
    res.json({ message: 'Review deleted successfully' });
    client.release();
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

module.exports = {
  createReview,
  getReviewsByBotId,
  updateReview,
  deleteReview,
};
```