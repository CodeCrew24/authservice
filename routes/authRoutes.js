const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.register);

// Login with client ID and secret
router.post('/login/client', authController.loginWithClientId);

// Get client ID and secret
router.get('/client', authController.getClientIdAndSecret); // Change POST to GET

// Regenerate client credentials
router.post('/regenerate-client-credentials', authController.regenerateClientCredentials);

module.exports = router;
