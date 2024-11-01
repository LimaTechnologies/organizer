import mongoose, { Schema, model, models } from 'mongoose';

const AttachmentSchema = new Schema({
  fileName: String,
  fileUrl: String,
  fileType: String,
});

const PromptSchema = new Schema({
  title: { type: String, required: true },
  focus: { type: String, required: true },
  prefixRecommendation: { type: String, required: true },
  promptContent: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [AttachmentSchema],
  archived: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const Prompt = models.Prompt || model('Prompt', PromptSchema);