const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const tokenExp = decoded.exp * 1000;
    const fiveMinutes = 5 * 60 * 1000;
    if (tokenExp - Date.now() < fiveMinutes) {
      req.tokenExpiring = true;
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    return res.status(403).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
};