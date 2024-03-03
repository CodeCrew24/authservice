// middleware/logger.js

const fs = require('fs');
const path = require('path');

// Create a log directory if it doesn't exist
const logDirectory = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Create a write stream for logging
const logStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

// Logger middleware function
const logger = (req, res, next) => {
  // Log request method, URL, and timestamp
  const logData = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`;
  console.log(logData);

  // Write log data to file
  logStream.write(logData + '\n');

  next();
};

module.exports = logger;
