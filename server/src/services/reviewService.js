const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createReview = async (botId, comment, rating, userId) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO reviews (bot_id, comment, rating, user_id) VALUES ($1, $2, $3, $4) RETURNING ',
      [botId, comment, rating, userId]
    );
    const newReview = result.rows[0];
    client.release();
    return newReview;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
};

const getReviewsByBotId = async (botId) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT r., u.username, u.id as user_id FROM reviews r JOIN users u ON r.user_id = u.id WHERE bot_id = $1',
      [botId]
    );
    const reviews = result.rows;
    client.release();
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
};


const updateReview = async (reviewId, comment, rating, userId) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT  FROM reviews WHERE id = $1 AND user_id = $2',
      [reviewId, userId]
    );
    if(result.rows.length === 0){
        throw new Error("Review not found or unauthorized to update");
    }
    await client.query(
      'UPDATE reviews SET comment = $1, rating = $2 WHERE id = $3',
      [comment, rating, reviewId]
    );
    client.release();
    return { message: 'Review updated successfully' };
  } catch (error) {
    console.error('Error updating review:', error);
    throw new Error('Failed to update review');
  }
};

const deleteReview = async (reviewId, userId) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
        'SELECT  FROM reviews WHERE id = $1 AND user_id = $2',
        [reviewId, userId]
      );
      if(result.rows.length === 0){
          throw new Error("Review not found or unauthorized to delete");
      }
    await client.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
    client.release();
    return { message: 'Review deleted successfully' };
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Failed to delete review');
  }
};

module.exports = {
  createReview,
  getReviewsByBotId,
  updateReview,
  deleteReview,
};
```