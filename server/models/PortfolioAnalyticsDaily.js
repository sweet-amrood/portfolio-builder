import mongoose from 'mongoose';

const portfolioAnalyticsDailySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    visits: {
      type: Number,
      default: 0,
      min: 0,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    messages: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

portfolioAnalyticsDailySchema.index({ owner: 1, date: 1 }, { unique: true });

export default mongoose.model('PortfolioAnalyticsDaily', portfolioAnalyticsDailySchema);
