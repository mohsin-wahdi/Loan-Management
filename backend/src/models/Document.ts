import mongoose, { Document, Schema, Types } from "mongoose";

export interface IDocument extends Document {
  loan: Types.ObjectId;
  user: Types.ObjectId;
  filePath: string;
  fileType: string;
  originalName: string;
}

const documentSchema = new Schema<IDocument>(
  {
    loan: { type: Schema.Types.ObjectId, ref: "Loan", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    originalName: { type: String, required: true }
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.model<IDocument>("Document", documentSchema);
