import mongoose from 'mongoose';

const portfolioAnalyticsEventSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ['visit', 'click', 'message'],
      required: true,
      index: true,
    },
    label: {
      type: String,
      default: '',
      trim: true,
      maxlength: 200,
    },
    visitorId: {
      type: String,
      default: '',
      trim: true,
      maxlength: 80,
    },
  },
  { timestamps: true }
);

portfolioAnalyticsEventSchema.index({ owner: 1, createdAt: -1 });
portfolioAnalyticsEventSchema.index({ owner: 1, type: 1, visitorId: 1, slug: 1, createdAt: -1 });

portfolioAnalyticsEventSchema.methods.toFeedObject = function () {
  return {
    id: this._id,
    type: this.type,
    label: this.label,
    slug: this.slug,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('PortfolioAnalyticsEvent', portfolioAnalyticsEventSchema);
