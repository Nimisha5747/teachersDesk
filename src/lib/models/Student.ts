import mongoose, { Schema, Document, Model, models, Types } from 'mongoose';

export interface IStudent extends Document {
  teacherId: Types.ObjectId;
  name: string;
  grade: string;
  section: string;
  email?: string;
  phone?: string;
  parentName?: string;
  avatar?: string;
  rollNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  createdAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    email: { type: String, trim: true },
    phone: { type: String },
    parentName: { type: String },
    avatar: { type: String },
    rollNumber: { type: String },
    dateOfBirth: { type: Date },
    address: { type: String },
  },
  { timestamps: true }
);

const Student: Model<IStudent> = models.Student || mongoose.model<IStudent>('Student', StudentSchema);
export default Student;
