const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');


router.post('/register', [
    body('username').isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const newUser = await userController.registerUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const authData = await userController.loginUser(req.body);
        res.json(authData);
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to log in user' });
    }
});


router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const user = await userController.getUserById(req.params.userId);
        res.json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

router.put('/:userId', authMiddleware, [
    body('username').optional().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        await userController.updateUser(req.params.userId, req.body);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});


router.post('/:botId/favorites', authMiddleware, async (req, res) => {
    try {
        await userController.addToFavorites(req, res);
        res.json({ message: 'Bot added to favorites' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Failed to add bot to favorites' });
    }
});


router.delete('/:botId/favorites', authMiddleware, async (req, res) => {
    try {
        await userController.removeFromFavorites(req, res);
        res.json({ message: 'Bot removed from favorites' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ error: 'Failed to remove bot from favorites' });
    }
});

router.get('/favorites', authMiddleware, async (req, res) => {
    try {
        const favorites = await userController.getUserFavorites(req, res);
        res.json(favorites);
    } catch (error) {
        console.error('Error getting user favorites:', error);
        res.status(500).json({ error: 'Failed to get user favorites' });
    }
});

module.exports = router;
```