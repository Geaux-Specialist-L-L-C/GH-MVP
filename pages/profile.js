import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import withAuth from '../utils/withAuth';
import ProfileForm from '../components/profile/ProfileForm';
import ImageUpload from '../components/profile/ImageUpload';
import styles from '../styles/Profile.module.css';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function ProfilePage() {
  const { user, getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = getToken();
        
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load profile');
        }
        
        setProfile(data.data);
        setError(null);
        
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      fetchProfile();
    }
  }, [user, getToken]);

  // Handle profile update
  const handleProfileUpdate = async (profileData) => {
    try {
      setLoading(true);
      
      const token = getToken();
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      setProfile(data.data);
      setSuccess('Profile updated successfully!');
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile image upload
  const handleImageUpload = (newAvatarUrl) => {
    // Update user avatar in the UI
    user.avatar = newAvatarUrl;
    
    // Show success message
    setSuccess('Profile image updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>My Profile | Geaux HelpED</title>
        <meta name="description" content="Manage your Geaux HelpED profile" />
      </Head>
      
      <main className={styles.main}>
        <h1 className={styles.title}>My Profile</h1>
        
        {loading && !profile ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
            <p>Loading profile...</p>
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <>
            {success && (
              <div className={styles.successMessage}>
                {success}
              </div>
            )}
            
            <div className={styles.profileGrid}>
              <div className={styles.profileSidebar}>
                <ImageUpload 
                  currentAvatar={user?.avatar}
                  onImageUpload={handleImageUpload}
                />
                
                <div className={styles.userInfoCard}>
                  <h2>{user.firstName} {user.lastName}</h2>
                  <p className={styles.userRole}>{user.role.replace('_', ' ')}</p>
                  <p className={styles.userEmail}>{user.email}</p>
                </div>
              </div>
              
              <div className={styles.profileContent}>
                <ProfileForm 
                  profile={profile} 
                  userRole={user.role} 
                  onSubmit={handleProfileUpdate}
                  isSubmitting={loading}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Protect this page for authenticated users only
export default withAuth(ProfilePage);