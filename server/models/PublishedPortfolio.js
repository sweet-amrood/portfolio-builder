import mongoose from 'mongoose';

const publishedPortfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    templateId: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    sectionOrder: {
      type: [String],
      default: [],
    },
    themeId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['live', 'archived'],
      default: 'archived',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

publishedPortfolioSchema.index({ user: 1, templateId: 1 }, { unique: true });
publishedPortfolioSchema.index(
  { user: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'live' },
  }
);

publishedPortfolioSchema.methods.toPublicObject = function () {
  return {
    templateId: this.templateId,
    content: this.content,
    sectionOrder: this.sectionOrder,
    themeId: this.themeId,
    publishedAt: this.publishedAt,
    updatedAt: this.updatedAt,
  };
};

publishedPortfolioSchema.methods.toOwnerObject = function () {
  return {
    id: this._id,
    templateId: this.templateId,
    status: this.status,
    publishedAt: this.publishedAt,
    archivedAt: this.archivedAt,
    updatedAt: this.updatedAt,
    content: this.content,
    sectionOrder: this.sectionOrder,
    themeId: this.themeId,
  };
};

export default mongoose.model('PublishedPortfolio', publishedPortfolioSchema);
