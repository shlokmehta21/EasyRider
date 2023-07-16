import mongoose from "mongoose";
import IDb from "../models/interfaces/IDb";
import { Ride } from "../models/Ride";
import { v4 as uuidv4 } from "uuid";

class RideModel extends mongoose.Model<Ride> {}
const RideSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Ride ID is required"],
    default: uuidv4(),
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
  noOfSeats: {
    type: Number,
    required: [true, "No of Seats is required"],
  },
  seatsLeft: {
    type: Number,
    required: [true, "Seats Left is required"],
  },
  pickUp: {
    location: {
      lat: {
        type: Number,
        required: true,
      },
      long: {
        type: Number,
        required: true,
      },
    },
    time: {
      type: Date,
      required: true,
    },
  },
  dropOff: {
    location: {
      lat: {
        type: Number,
        required: true,
      },
      long: {
        type: Number,
        required: true,
      },
    },
    time: {
      type: Date,
      required: true,
    },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});
RideSchema.index({ "pickUp.location": "2dsphere" });
const RideDB: mongoose.Model<Ride, RideModel> = mongoose.model<Ride, RideModel>(
  "Ride",
  RideSchema
);

class RideDbModel extends IDb<Ride, RideModel> {
  ride: RideModel;
  constructor(ride: RideModel = null) {
    super(RideDB);
    this.ride = ride;
  }
}

export default RideDbModel;
