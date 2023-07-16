import mongoose from "mongoose";
import IDb from "../models/interfaces/IDb";
import Booking from "../models/Booking";
import { v4 as uuidv4 } from "uuid";

class BookingModel extends mongoose.Model<Booking> {}

const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: uuidv4(),
  },
  userId: {
    type: String,
    required: true,
  },
  rideId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: ["REQUESTED", "CONFIRMED", "CANCELLED"],
    default: "REQUESTED",
  },
});

const BookingDB: mongoose.Model<Booking, BookingModel> = mongoose.model<
  Booking,
  BookingModel
>("booking", bookingSchema);

class BookingDBModel extends IDb<Booking, BookingModel> {
  constructor() {
    super(BookingDB);
  }
}

export default BookingDBModel;
