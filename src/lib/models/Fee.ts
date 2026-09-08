import mongoose, { Schema, Document, Model, models, Types } from 'mongoose';

export interface IFee extends Document {
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  title: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;
  note?: string;
  month?: string;
  year?: number;
  createdAt: Date;
}

const FeeSchema = new Schema<IFee>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    status: { type: String, enum: ['pending', 'paid', 'overdue', 'partial'], default: 'pending' },
    paidAmount: { type: Number, default: 0 },
    note: { type: String },
    month: { type: String },
    year: { type: Number },
  },
  { timestamps: true }
);

const Fee: Model<IFee> = models.Fee || mongoose.model<IFee>('Fee', FeeSchema);
export default Fee;
