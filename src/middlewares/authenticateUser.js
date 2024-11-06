const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');
  //.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ status: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ status: false, message: 'Invalid token.' });
  }
};

module.exports = authenticateUser;
