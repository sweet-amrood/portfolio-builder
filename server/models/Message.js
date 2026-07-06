import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    senderType: {
      type: String,
      enum: ['visitor', 'owner'],
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

messageSchema.methods.toChatObject = function () {
  return {
    id: this._id,
    conversationId: this.conversation,
    senderType: this.senderType,
    body: this.body,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('Message', messageSchema);
