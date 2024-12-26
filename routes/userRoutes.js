const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/usuarios', registerUser);
router.post('/login', loginUser);
router.get('/usuarios', authenticate, getUser);

module.exports = router;
