import dbConnect from '../../../lib/dbConnect';
import Profile from '../../../models/Profile';
import { authenticate } from '../../../middleware/auth';
import { checkPermission, PERMISSIONS } from '../../../middleware/permissions';

export default async function handler(req, res) {
  // Connect to database
  await dbConnect();
  
  // Authenticate the request
  authenticate(req, res, async () => {
    // Check method
    if (req.method === 'GET') {
      // Get user profile
      await getProfile(req, res);
    } else if (req.method === 'PUT') {
      // Update user profile
      await updateProfile(req, res);
    } else {
      // Method not allowed
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  });
}

/**
 * Get user profile
 */
async function getProfile(req, res) {
  try {
    // Get user ID from authenticated token
    const userId = req.user.id;
    
    // Find profile by user ID
    const profile = await Profile.findOne({ userId }).populate('userId', 'firstName lastName email role');
    
    // If profile doesn't exist, return empty profile structure
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found'
      });
    }
    
    // Return the profile
    return res.status(200).json({
      success: true,
      data: profile
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * Update user profile
 */
async function updateProfile(req, res) {
  try {
    // Get user ID from authenticated token
    const userId = req.user.id;
    
    // Get profile data from request body
    const profileData = req.body;
    
    // Find profile by user ID
    let profile = await Profile.findOne({ userId });
    
    // Create profile if it doesn't exist
    if (!profile) {
      profile = new Profile({
        userId,
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Update profile fields based on user role
      if (req.user.role === 'caregiver') {
        // Only update caregiver fields
        profile.bio = profileData.bio || profile.bio;
        profile.address = profileData.address || profile.address;
        profile.emergencyContact = profileData.emergencyContact || profile.emergencyContact;
        profile.preferences = profileData.preferences || profile.preferences;
        profile.caregiverDetails = profileData.caregiverDetails || profile.caregiverDetails;
      } else if (req.user.role === 'care_recipient') {
        // Only update care recipient fields
        profile.bio = profileData.bio || profile.bio;
        profile.address = profileData.address || profile.address;
        profile.emergencyContact = profileData.emergencyContact || profile.emergencyContact;
        profile.preferences = profileData.preferences || profile.preferences;
        profile.careRecipientDetails = profileData.careRecipientDetails || profile.careRecipientDetails;
      } else if (req.user.role === 'admin') {
        // Admins can update all fields
        Object.assign(profile, profileData);
      }
      
      // Update the updatedAt timestamp
      profile.updatedAt = new Date();
    }
    
    // Save the profile
    await profile.save();
    
    // Return the updated profile
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}