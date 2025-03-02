import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { authenticate } from '../../../middleware/auth';
import { IncomingForm } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Check method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  // Authenticate the request
  authenticate(req, res, async () => {
    try {
      // Connect to database
      await dbConnect();
      
      // Get user ID from authenticated token
      const userId = req.user.id;
      
      // Parse the incoming form data
      const form = new IncomingForm({
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB
      });
      
      // Parse form
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });
      
      // Check if file exists
      if (!files.image) {
        return res.status(400).json({ success: false, message: 'No image file provided' });
      }
      
      // Get file path
      const filePath = files.image.filepath;
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'geaux-helped/avatars',
        use_filename: true,
        unique_filename: true,
      });
      
      // Clean up temp file
      fs.unlinkSync(filePath);
      
      // Update user avatar URL
      const user = await User.findById(userId);
      user.avatar = result.secure_url;
      user.updatedAt = new Date();
      await user.save();
      
      // Return success with avatar URL
      return res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: {
          avatarUrl: result.secure_url
        }
      });
      
    } catch (error) {
      console.error('Image upload error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
}