import jwt from 'jsonwebtoken';
import User from '../models/User';

/**
 * Middleware to authenticate JWT token and add user to request
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export function authenticate(req, res, next) {
  // Get token from headers
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user data to request for use in route handlers
    req.user = decoded;
    
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ success: false, message: 'Token expired' });
    } else {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

/**
 * Middleware to authenticate and verify user in database
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export async function authenticateAndVerifyUser(req, res, next) {
  // Authenticate token first
  authenticate(req, res, async () => {
    try {
      // Find user in database to ensure they still exist and are active
      const user = await User.findById(req.user.id);
      
      // Check if user exists
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // Check if user is active
      if (user.status !== 'active') {
        return res.status(403).json({ success: false, message: 'Account is not active' });
      }
      
      // Add full user object to request
      req.dbUser = user;
      
      next();
      
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
}

/**
 * Utility to get authenticated user from request and token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object|null} - User object or null if authentication fails
 */
export async function getAuthenticatedUser(req, res) {
  // Get token from headers
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ success: false, message: 'Authorization token required' });
    return null;
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.id);
    
    // Check if user exists
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return null;
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      res.status(403).json({ success: false, message: 'Account is not active' });
      return null;
    }
    
    return user;
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(403).json({ success: false, message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      res.status(403).json({ success: false, message: 'Token expired' });
    } else {
      res.status(500).json({ success: false, message: 'Server error' });
    }
    return null;
  }
}

/**
 * Middleware to check if user has specified role
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} - Middleware function
 */
export function checkRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: insufficient role' 
      });
    }
    
    next();
  };
}