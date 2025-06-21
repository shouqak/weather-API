import  bcrypt  from 'bcryptjs';
import mongoose, { Schema, Document } from 'mongoose';

export interface UsersCollection extends Document {
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UsersCollection>({
  email: {
 type: String,
 required: true,
 unique: true },

  password: { 
  type: String,
   required: true, 
   select: false },

  role: { 
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
  required: true
},
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
});


const User = mongoose.model<UsersCollection>('User', userSchema);
export default User;