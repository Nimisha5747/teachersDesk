import mongoose, { Schema, Document, Model, models, Types } from 'mongoose';

export interface IAttendance extends Document {
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
  createdAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
    note: { type: String },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate attendance entries per student per day
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

const Attendance: Model<IAttendance> = models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
export default Attendance;
