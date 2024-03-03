const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'moderator', 'guest', 'superadmin'], default: 'user' },
  clientId: { type: String },
  clientSecret: { type: String }
});

module.exports = mongoose.model('User', userSchema);
