const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');
const authMiddleware = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

router.get('/', botController.getAllBots);

router.get('/:botId', botController.getBotById);

router.post('/', authMiddleware, [
    body('name').isLength({ min: 3, max: 100 }).withMessage('Bot name must be between 3 and 100 characters'),
    body('description').notEmpty().withMessage('Description is required'),
    body('inviteLink').isURL().withMessage('Invalid invite link'),
    body('category').isNumeric().withMessage('Invalid category ID'),
    body('ownerId').isNumeric().withMessage('Invalid owner ID')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const newBot = await botController.createBot(req.body);
        res.status(201).json(newBot);
    } catch (error) {
        console.error('Error creating bot:', error);
        res.status(500).json({ error: 'Failed to create bot' });
    }
});


router.put('/:botId', authMiddleware, [
    body('name').optional().isLength({ min: 3, max: 100 }).withMessage('Bot name must be between 3 and 100 characters'),
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('inviteLink').optional().isURL().withMessage('Invalid invite link'),
    body('category').optional().isNumeric().withMessage('Invalid category ID'),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
      await botController.updateBot(req.params.botId, req.body);
      res.json({ message: 'Bot updated successfully' });
    } catch (error) {
      console.error('Error updating bot:', error);
      res.status(500).json({ error: 'Failed to update bot' });
    }
  });

router.delete('/:botId', authMiddleware, botController.deleteBot);

router.put('/:botId/approve', authMiddleware, botController.approveBot);

module.exports = router;
```