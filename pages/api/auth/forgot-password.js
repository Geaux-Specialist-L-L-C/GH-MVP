import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import crypto from 'crypto';
import { sendEmail } from '../../../lib/email';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    // Connect to database
    await dbConnect();
    
    // Get request body
    const { email } = req.body;
    
    // Validate inputs
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ success: true, message: 'If your email is registered, you will receive a password reset link' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and store in database
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set token expiry (1 hour)
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1);
    
    // Update user with reset token information
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = tokenExpiry;
    user.updatedAt = new Date();
    await user.save();
    
    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    // Send email with reset link
    await sendEmail({
      to: user.email,
      subject: 'Geaux HelpED - Password Reset',
      text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}. This link is valid for 1 hour.`,
      html: `
        <h1>Geaux HelpED Password Reset</h1>
        <p>You requested a password reset. Please click the button below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #4a6fa5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p>This link is valid for 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    });
    
    // Return success
    return res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}