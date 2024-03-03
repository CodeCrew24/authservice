const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');


exports.register = async (req, res) => {
    try {
      const { username, password, role } = req.headers;
  
      // Check if username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Generate client ID and client secret
      const { clientId, clientSecret } = authService.generateClientCredentials();
  
      // Create a new user
      const user = new User({ username, password: hashedPassword, role, clientId, clientSecret });
      await user.save();
  
      res.status(201).json({ 
        message: 'User registered successfully',
        clientId,
        clientSecret
    });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
exports.loginWithClientId = async (req, res) => {
    try {
      const clientId = req.headers['clientid'];
      const clientSecret = req.headers['clientsecret'];
  
      // Find the user by client ID
      const user = await User.findOne({ clientId });
      if (!user || user.clientSecret !== clientSecret) {
        return res.status(401).json({ message: 'Invalid client credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
      const expiresIn = 12 * 60 * 60; // 12 hours in seconds
  
      // Send response with token, token type, and expires in
      res.json({ 
        token,
        token_type: 'Bearer',
        expires_in: expiresIn
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
exports.getClientIdAndSecret = async (req, res) => {
  try {
    const username = req.headers['username'];
    const password = req.headers['password'];

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Respond with client ID and client secret
    res.json({ clientId: user.clientId, clientSecret: user.clientSecret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.regenerateClientCredentials = async (req, res) => {
    try {
      const { username, password } = req.headers;
      console.log("Username:", username);
      console.log("Password:", password);
  
      // Find the user by username and password
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate new client ID and client secret
      const { clientId, clientSecret } = authService.generateClientCredentials();
  
      // Update user with new credentials
      user.clientId = clientId;
      user.clientSecret = clientSecret;
      await user.save();
  
      res.json({ 
        message: 'Client credentials regenerated successfully', 
        clientId: clientId, 
        clientSecret: clientSecret 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  