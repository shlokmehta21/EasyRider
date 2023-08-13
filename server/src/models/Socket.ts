import { Document } from "mongoose";

export interface Socket extends Document {
  id: string;
  socketId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isAlive: number;
}
