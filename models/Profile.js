import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  street: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true,
    default: 'USA'
  }
});

const EmergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  relationship: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  }
});

const NotificationPreferencesSchema = new mongoose.Schema({
  email: {
    type: Boolean,
    default: true
  },
  sms: {
    type: Boolean,
    default: false
  },
  push: {
    type: Boolean,
    default: true
  }
});

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  address: AddressSchema,
  emergencyContact: EmergencyContactSchema,
  preferences: {
    notifications: NotificationPreferencesSchema,
    timezone: {
      type: String,
      default: 'America/New_York'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  caregiverDetails: {
    certifications: [String],
    specialties: [String],
    yearsOfExperience: Number
  },
  careRecipientDetails: {
    primaryConditions: [String],
    primaryCaregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dateOfBirth: Date,
    mobility: {
      type: String,
      enum: ['independent', 'assistive_device', 'wheelchair', 'bedbound']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);