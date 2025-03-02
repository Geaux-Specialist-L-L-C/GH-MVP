import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { authenticateToken } from '../../../middleware/auth';

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    // Authenticate user
    const user = await authenticateToken(req, res);
    if (!user) {
      return; // Response is already handled in authenticateToken
    }
    
    // Connect to database
    await dbConnect();
    
    // Get user details without password
    const userDetails = await User.findById(user.id).select('-password');
    if (!userDetails) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Return user data
    return res.status(200).json({
      success: true,
      data: userDetails
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}