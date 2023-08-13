import mongoose from "mongoose";
import IDb from "../models/interfaces/IDb";
import { Ride } from "../models/Ride";
import { v4 as uuidv4 } from "uuid";

class RideModel extends mongoose.Model<Ride> {}
const RideSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Ride ID is required"],
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
  noOfSeats: {
    type: Number,
    required: [true, "No of Seats is required"],
  },
  seatsLeft: {
    type: Number,
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
    time: {
      type: Date,
      required: true,
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
// Attach the pre middleware to the schema
RideSchema.pre("save", function (next) {
  if (!this.seatsLeft) {
    this.seatsLeft = this.noOfSeats;
  }
  next();
});

// Index for pickUp.location and dropOff.location fields
RideSchema.index({
  "pickUp.location": "2dsphere",
  "dropOff.location": "2dsphere",
});

const RideDB: mongoose.Model<Ride, RideModel> = mongoose.model<Ride, RideModel>(
  "Ride",
  RideSchema
);
class RideDbModel extends IDb<Ride, RideModel> {
  constructor() {
    super(RideDB);
  }
}

export default RideDbModel;
