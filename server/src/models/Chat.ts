import mongoose from "mongoose";

export interface Chat extends mongoose.Document {
  sender: string;
  receiver: string;
  rideId: string;
  createdAt: Date;
  delivered: number;
  read: number;
}
