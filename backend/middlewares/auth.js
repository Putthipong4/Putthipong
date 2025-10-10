const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.JWT_SECRET;


const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send({ message: 'No Token Provided' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).send({ message: 'Invalid or Expired Token' });
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};