import mongoose, { Schema, Document, Model, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'teacher';
  emailVerified?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    image: { type: String },
    role: { type: String, default: 'teacher' },
    emailVerified: { type: Date },
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
