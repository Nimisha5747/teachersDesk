import mongoose, { Schema, Document, Model, models, Types } from 'mongoose';

export interface IRemark extends Document {
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  text: string;
  category: 'behavioral' | 'academic' | 'general' | 'positive' | 'concern';
  createdAt: Date;
}

const RemarkSchema = new Schema<IRemark>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    category: {
      type: String,
      enum: ['behavioral', 'academic', 'general', 'positive', 'concern'],
      default: 'general',
    },
  },
  { timestamps: true }
);

const Remark: Model<IRemark> = models.Remark || mongoose.model<IRemark>('Remark', RemarkSchema);
export default Remark;
