import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,
    },
    googleEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'both'],
      default: 'local',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    avatar: {
      type: String,
      default: '',
    },
    portfolioSlug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    googleEmail: this.googleEmail,
    authProvider: this.authProvider,
    isEmailVerified: this.isEmailVerified,
    avatar: this.avatar,
    portfolioSlug: this.portfolioSlug || null,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
