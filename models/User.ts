// models/User.ts
import mongoose, { Document, Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ISecurityQuestion {
  question: string;
  answer: string; // This will be hashed
}

export interface IUserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
    newsletter: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showLastSeen: boolean;
    allowSearchByEmail: boolean;
  };
  preferences: {
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
    currency: string;
    pageSize: number;
  };
  twoFactorAuth: {
    enabled: boolean;
    method: 'sms' | 'email' | 'authenticator' | null;
    backupCodes: string[];
  };
}

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin' | 'superadmin';
  isApproved: boolean;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  securityQuestions: ISecurityQuestion[];
  settings: IUserSettings;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  hashSecurityAnswer(answer: string): Promise<string>;
  compareSecurityAnswer(candidateAnswer: string, hashedAnswer: string): Promise<boolean>;
  isLocked(): boolean;
  incLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const securityQuestionSchema = new Schema<ISecurityQuestion>({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  }
}, { _id: false });

const userSettingsSchema = new Schema<IUserSettings>({
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  language: {
    type: String,
    default: 'en'
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  emailNotifications: {
    marketing: {
      type: Boolean,
      default: true
    },
    security: {
      type: Boolean,
      default: true
    },
    updates: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: false
    }
  },
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public'
    },
    showEmail: {
      type: Boolean,
      default: false
    },
    showLastSeen: {
      type: Boolean,
      default: true
    },
    allowSearchByEmail: {
      type: Boolean,
      default: true
    }
  },
  preferences: {
    dateFormat: {
      type: String,
      enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
      default: 'MM/DD/YYYY'
    },
    timeFormat: {
      type: String,
      enum: ['12h', '24h'],
      default: '12h'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    pageSize: {
      type: Number,
      min: 10,
      max: 100,
      default: 25
    }
  },
  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false
    },
    method: {
      type: String,
      enum: ['sms', 'email', 'authenticator'],
      default: null
    },
    backupCodes: [{
      type: String
    }]
  }
}, { _id: false });

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  passwordResetToken: {
    type: String,
    default: undefined
  },
  passwordResetExpiry: {
    type: Date,
    default: undefined
  },
  securityQuestions: {
    type: [securityQuestionSchema],
    validate: {
      validator: function(questions: ISecurityQuestion[]) {
        return questions.length === 0 || questions.length === 3;
      },
      message: 'Must have exactly 3 security questions or none'
    }
  },
  settings: {
    type: userSettingsSchema,
    default: () => ({}) // This will apply the schema defaults
  },
  lastLogin: {
    type: Date,
    default: undefined
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: undefined
  },
  emailVerificationToken: {
    type: String,
    default: undefined
  },
  emailVerificationExpiry: {
    type: Date,
    default: undefined
  }
}, {
  timestamps: false, // We're handling timestamps manually
  versionKey: '__v'
});

// Indexes for performance (removed duplicate email index)
// Note: email index is already created by unique: true above
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ isActive: 1, isApproved: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account lock status
userSchema.virtual('isAccountLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Pre-save middleware to hash password and update timestamp
userSchema.pre('save', async function(next) {
  try {
    // Update timestamp
    this.updatedAt = new Date();
    
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    // Hash password with cost of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to hash security question answers
userSchema.methods.hashSecurityAnswer = async function(answer: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    const normalizedAnswer = answer.toLowerCase().trim();
    return await bcrypt.hash(normalizedAnswer, salt);
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('Failed to hash security answer');
  }
};

// Method to compare security question answers
userSchema.methods.compareSecurityAnswer = async function(candidateAnswer: string, hashedAnswer: string): Promise<boolean> {
  try {
    const normalizedAnswer = candidateAnswer.toLowerCase().trim();
    return await bcrypt.compare(normalizedAnswer, hashedAnswer);
  } catch (error) {
    console.error('Comparison error:', error);
    return false;
  }
};

// Method to check if account is locked
userSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = async function(): Promise<void> {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { 
        loginAttempts: 1,
        updatedAt: new Date()
      }
    });
  }
  
  const updates: any = { 
    $inc: { loginAttempts: 1 },
    $set: { updatedAt: new Date() }
  };
  
  // Lock account after 5 attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { 
      lastLogin: new Date(),
      updatedAt: new Date()
    }
  });
};

// Create and export the model
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

// Predefined security questions (keeping from original)
export const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your elementary school?",
  "What is your favorite book?",
  "What was your childhood nickname?"
];