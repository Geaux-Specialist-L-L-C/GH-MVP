import { useState, useEffect } from 'react';
import styles from './ProfileForm.module.css';

export default function ProfileForm({ profile, userRole, onSubmit, isSubmitting }) {
  // Initialize state with profile data or defaults
  const [formData, setFormData] = useState({
    bio: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      timezone: 'America/New_York',
      language: 'en'
    },
    caregiverDetails: {
      certifications: [],
      specialties: [],
      yearsOfExperience: 0
    },
    careRecipientDetails: {
      primaryConditions: [],
      dateOfBirth: '',
      mobility: 'independent'
    }
  });
  
  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        ...formData,
        ...profile,
        // Handle nested objects that might be undefined
        address: profile.address || formData.address,
        emergencyContact: profile.emergencyContact || formData.emergencyContact,
        preferences: {
          ...formData.preferences,
          ...(profile.preferences || {}),
          notifications: {
            ...formData.preferences.notifications,
            ...(profile.preferences?.notifications || {})
          }
        },
        caregiverDetails: profile.caregiverDetails || formData.caregiverDetails,
        careRecipientDetails: profile.careRecipientDetails || formData.careRecipientDetails
      });
    }
  }, [profile]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested fields with dot notation (e.g., "address.street")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Handle nested object input changes
  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };
  
  // Handle notification preference changes
  const handleNotificationChange = (field, checked) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        notifications: {
          ...formData.preferences.notifications,
          [field]: checked
        }
      }
    });
  };
  
  // Handle array field changes (e.g., certifications, specialties)
  const handleArrayChange = (section, field, value) => {
    // Split comma-separated values into array
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: arrayValue
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form className={styles.profileForm} onSubmit={handleSubmit}>
      <div className={styles.formSection}>
        <h2>Basic Information</h2>
        
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows={4}
            className={styles.textarea}
          />
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h2>Address</h2>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="address.street">Street</label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address?.street || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="address.city">City</label>
            <input
              type="text"
              id="address.city"
              name="address.city"
              value={formData.address?.city || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="address.state">State</label>
            <input
              type="text"
              id="address.state"
              name="address.state"
              value={formData.address?.state || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="address.zipCode">ZIP Code</label>
            <input
              type="text"
              id="address.zipCode"
              name="address.zipCode"
              value={formData.address?.zipCode || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="address.country">Country</label>
            <input
              type="text"
              id="address.country"
              name="address.country"
              value={formData.address?.country || 'USA'}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h2>Emergency Contact</h2>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="emergencyContact.name">Name</label>
            <input
              type="text"
              id="emergencyContact.name"
              name="emergencyContact.name"
              value={formData.emergencyContact?.name || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="emergencyContact.relationship">Relationship</label>
            <input
              type="text"
              id="emergencyContact.relationship"
              name="emergencyContact.relationship"
              value={formData.emergencyContact?.relationship || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="emergencyContact.phone">Phone</label>
            <input
              type="tel"
              id="emergencyContact.phone"
              name="emergencyContact.phone"
              value={formData.emergencyContact?.phone || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h2>Preferences</h2>
        
        <div className={styles.formGroup}>
          <label>Notification Preferences</label>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.preferences?.notifications?.email || false}
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
              />
              Email Notifications
            </label>
            
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.preferences?.notifications?.sms || false}
                onChange={(e) => handleNotificationChange('sms', e.target.checked)}
              />
              SMS Notifications
            </label>
            
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.preferences?.notifications?.push || false}
                onChange={(e) => handleNotificationChange('push', e.target.checked)}
              />
              Push Notifications
            </label>
          </div>
        </div>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="preferences.timezone">Timezone</label>
            <select
              id="preferences.timezone"
              name="preferences.timezone"
              value={formData.preferences?.timezone || 'America/New_York'}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Anchorage">Alaska Time (AKT)</option>
              <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="preferences.language">Language</label>
            <select
              id="preferences.language"
              name="preferences.language"
              value={formData.preferences?.language || 'en'}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Caregiver-specific fields */}
      {userRole === 'caregiver' && (
        <div className={styles.formSection}>
          <h2>Caregiver Information</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="caregiverCertifications">Certifications</label>
            <input
              type="text"
              id="caregiverCertifications"
              value={formData.caregiverDetails?.certifications?.join(', ') || ''}
              onChange={(e) => handleArrayChange('caregiverDetails', 'certifications', e.target.value)}
              placeholder="CNA, RN, etc. (comma separated)"
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="caregiverSpecialties">Specialties</label>
            <input
              type="text"
              id="caregiverSpecialties"
              value={formData.caregiverDetails?.specialties?.join(', ') || ''}
              onChange={(e) => handleArrayChange('caregiverDetails', 'specialties', e.target.value)}
              placeholder="Elderly care, special needs, etc. (comma separated)"
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="yearsOfExperience">Years of Experience</label>
            <input
              type="number"
              id="yearsOfExperience"
              name="caregiverDetails.yearsOfExperience"
              value={formData.caregiverDetails?.yearsOfExperience || 0}
              onChange={handleChange}
              min="0"
              className={styles.input}
            />
          </div>
        </div>
      )}
      
      {/* Care recipient-specific fields */}
      {userRole === 'care_recipient' && (
        <div className={styles.formSection}>
          <h2>Care Recipient Information</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="primaryConditions">Primary Conditions</label>
            <input
              type="text"
              id="primaryConditions"
              value={formData.careRecipientDetails?.primaryConditions?.join(', ') || ''}
              onChange={(e) => handleArrayChange('careRecipientDetails', 'primaryConditions', e.target.value)}
              placeholder="Diabetes, Alzheimer's, etc. (comma separated)"
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="careRecipientDetails.dateOfBirth"
              value={formData.careRecipientDetails?.dateOfBirth ? new Date(formData.careRecipientDetails.dateOfBirth).toISOString().substr(0, 10) : ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="mobility">Mobility</label>
            <select
              id="mobility"
              name="careRecipientDetails.mobility"
              value={formData.careRecipientDetails?.mobility || 'independent'}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="independent">Independent</option>
              <option value="assistive_device">Assistive Device</option>
              <option value="wheelchair">Wheelchair</option>
              <option value="bedbound">Bedbound</option>
            </select>
          </div>
        </div>
      )}
      
      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}