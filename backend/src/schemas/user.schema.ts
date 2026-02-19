import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string; // In a real app, store hash.
    role: 'Manager' | 'Employee';
    gender?: string;
    avatarUrl?: string;
    position?: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Manager', 'Employee'], default: 'Employee' },
    gender: { type: String },
    avatarUrl: { type: String, default: 'https://via.placeholder.com/150' },
    position: { type: String, default: 'Staff' }
}, {
    timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);
