import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
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
      index: true,
    },
    visitorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    visitorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    lastMessage: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    unreadByOwner: {
      type: Number,
      default: 0,
      min: 0,
    },
    unreadByVisitor: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ owner: 1, visitorEmail: 1, slug: 1 });

conversationSchema.methods.toListObject = function () {
  return {
    id: this._id,
    slug: this.slug,
    visitorName: this.visitorName,
    visitorEmail: this.visitorEmail,
    lastMessage: this.lastMessage,
    lastMessageAt: this.lastMessageAt,
    unreadByOwner: this.unreadByOwner,
    unreadByVisitor: this.unreadByVisitor,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model('Conversation', conversationSchema);
