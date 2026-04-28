import mongoose, { Document, Schema, Types } from "mongoose";

export interface IActivity extends Document {
  user: Types.ObjectId;
  action: string;
  details: string;
}

const activitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    details: { type: String, required: true }
  },
  { timestamps: true }
);

export const ActivityModel = mongoose.model<IActivity>("Activity", activitySchema);
