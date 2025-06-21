import mongoose, { Document, Schema, Types } from 'mongoose';
import  {UsersCollection}  from '../models/user.model';
import { WeatherCollection } from './weather.model';

export interface HistoryCollection extends Document {
  user: Types.ObjectId | UsersCollection;
  weather: Types.ObjectId | WeatherCollection;
  lat: number;
  lon: number;
  requestedAt: Date;
}
const historySchema = new Schema<HistoryCollection>(
  {
    user: {
   type: Schema.Types.ObjectId,
   ref: 'User', 
  required: true },

    weather: { 
  type: Schema.Types.ObjectId, 
  ref: 'Weather',
 required: true },

    lat: { 
  type: Number, 
  required: true },

    lon: { 
  type: Number, 
  required: true },
  
    requestedAt: { 
  type: Date, default: Date.now },
  },
  { timestamps: false }
);
// index
historySchema.index({ user: 1, requestedAt: -1 });

export default mongoose.model<HistoryCollection>('History', historySchema);