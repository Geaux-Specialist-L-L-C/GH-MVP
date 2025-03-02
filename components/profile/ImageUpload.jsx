import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ImageUpload.module.css';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ImageUpload({ currentAvatar, onImageUpload }) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Default avatar if none provided
  const avatarUrl = currentAvatar || '/images/default-avatar.png';
  
  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.includes('image')) {
      setError('Please select an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    // Clear previous errors
    setError(null);
    
    // Upload image
    try {
      setLoading(true);
      
      const token = getToken();
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/profile/upload-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }
      
      // Call parent component callback with new avatar URL
      onImageUpload(data.data.avatarUrl);
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className={styles.imageUpload}>
      <div className={styles.avatarContainer}>
        <img
          src={avatarUrl}
          alt="Profile"
          className={styles.avatar}
        />
        
        {loading && (
          <div className={styles.loadingOverlay}>
            <LoadingSpinner />
          </div>
        )}
      </div>
      
      <div className={styles.uploadControls}>
        <button
          type="button"
          onClick={handleButtonClick}
          className={styles.uploadButton}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Change Profile Picture'}
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className={styles.fileInput}
        />
        
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    </div>
  );
}