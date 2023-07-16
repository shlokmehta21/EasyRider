import { Document } from "mongoose";

interface Booking extends Document {
  id: string;
  userId: string;
  rideId: string;
  status: string;
  createdAt: Date;
}

export default Booking;
