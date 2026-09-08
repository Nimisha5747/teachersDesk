import mongoose, { Schema, Document, Model, models, Types } from 'mongoose';

export interface IHomework extends Document {
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  title: string;
  subject: string;
  description?: string;
  dueDate: Date;
  assignedDate: Date;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
  remarks?: string;
  createdAt: Date;
}

const HomeworkSchema = new Schema<IHomework>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    assignedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'submitted', 'graded', 'overdue'], default: 'pending' },
    grade: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);

const Homework: Model<IHomework> = models.Homework || mongoose.model<IHomework>('Homework', HomeworkSchema);
export default Homework;
