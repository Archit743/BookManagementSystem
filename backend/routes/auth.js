const jwt = require('jsonwebtoken');
const UserSecret = process.env.JWT_USER_SECRET;

// const auth = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication failed' });
//   }

//   try {
//     const decoded = jwt.verify(token, UserSecret);
//     req.user = decoded; // Attach user info to the request
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, UserSecret);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(400).send({ message: 'Invalid token.' });
  }
};


module.exports = { auth, UserSecret };
