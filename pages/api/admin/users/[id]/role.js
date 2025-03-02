import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/User';
import { authenticate } from '../../../../../middleware/auth';
import { checkPermission, PERMISSIONS } from '../../../../../middleware/permissions';

export default async function handler(req, res) {
  // Only allow PATCH method for updating roles
  if (req.method !== 'PATCH') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  // Chain middleware manually since Next.js API routes don't support Express-style middleware chaining
  authenticate(req, res, async () => {
    checkPermission(PERMISSIONS.USER_MANAGE_ROLES)(req, res, async () => {
      try {
        // Connect to database
        await dbConnect();
        
        // Get user ID from URL
        const { id } = req.query;
        
        // Get new role from request body
        const { role } = req.body;
        
        // Validate role
        const validRoles = ['caregiver', 'care_recipient', 'admin'];
        if (!role || !validRoles.includes(role)) {
          return res.status(400).json({ success: false, message: 'Valid role is required' });
        }
        
        // Find user by ID
        const user = await User.findById(id);
        
        // Check if user exists
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Prevent admins from demoting themselves
        if (user._id.toString() === req.user.id && role !== 'admin') {
          return res.status(403).json({ 
            success: false, 
            message: 'Cannot change your own admin role' 
          });
        }
        
        // Update user role
        user.role = role;
        user.updatedAt = new Date();
        await user.save();
        
        // Create audit log
        // This is simplified - in production we would use a proper audit log service
        console.log(`User ${req.user.id} changed role of user ${id} from ${user.role} to ${role} at ${new Date().toISOString()}`);
        
        // Return success
        return res.status(200).json({
          success: true,
          message: 'User role updated successfully',
          data: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        });
        
      } catch (error) {
        console.error('Update role error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
    });
  });
}