import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPayment extends Document {
  loan: Types.ObjectId;
  utr: string;
  amount: number;
  paymentDate: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    loan: { type: Schema.Types.ObjectId, ref: "Loan", required: true },
    utr: { type: String, required: true, unique: true, uppercase: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true }
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>("Payment", paymentSchema);
