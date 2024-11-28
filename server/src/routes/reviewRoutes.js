const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { botId, comment, rating } = req.body;
    const userId = req.user.userId; 
    const newReview = await reviewController.createReview(botId, comment, rating, userId);
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

router.get('/:botId', async (req, res) => {
  try {
    const botId = req.params.botId;
    const reviews = await reviewController.getReviewsByBotId(botId);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.put('/:reviewId', authMiddleware, async (req, res) => {
    const reviewId = req.params.reviewId;
    const { comment, rating } = req.body;
    try {
      const updatedReview = await reviewController.updateReview(reviewId, comment, rating, req.user.userId);
      res.json(updatedReview);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Failed to update review' });
    }
  });


router.delete('/:reviewId', authMiddleware, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    await reviewController.deleteReview(reviewId, req.user.userId);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
```