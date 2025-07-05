const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;
  
    if (!apiKey) {
      return res.status(401).json({ 
        success: false, 
        message: 'API key is required' 
      });
    }
  
    if (apiKey !== validApiKey) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid API key' 
      });
    }
  
    next();
  };

module.exports = apiKeyAuth;