import mongoose from "mongoose";
import IDb from "../models/interfaces/IDb";
import { MyRides } from "../models/MyRides";
import { v4 as uuidv4 } from "uuid";

class MyRidesModel extends mongoose.Model<MyRides> {}
const MyRidesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "My Rides ID is required"],
    default: uuidv4,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: [true, "User Id is required"],
  },
  carId: {
    type: String,
    required: [true, "Car Id is required"],
  },
  rideId: {
    type: String,
    required: [true, "Ride Id is required"],
  },
  noOfSeats: {
    type: Number,
    required: [true, "No of Seats is required"],
  },
  pickUp: {
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  },
  dropOff: {
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

// Index for pickUp.location and dropOff.location fields
MyRidesSchema.index({
  "pickUp.location": "2dsphere",
  "dropOff.location": "2dsphere",
});

const MyRidesDB: mongoose.Model<MyRides, MyRidesModel> = mongoose.model<
  MyRides,
  MyRidesModel
>("MyRides", MyRidesSchema);
class MyRidesDbModel extends IDb<MyRides, MyRidesModel> {
  constructor() {
    super(MyRidesDB);
  }
}

export default MyRidesDbModel;
