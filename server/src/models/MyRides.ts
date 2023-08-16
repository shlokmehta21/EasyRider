import { Document } from "mongoose";
import { ILocation } from "./Location";

export interface MyRides extends Document {
  id: string;
  userId: string;
  carId: string;
  rideId: string;
  noOfSeats: number;
  seatsLeft: number;
  pickUp: {
    location: ILocation;
  };
  dropOff: {
    location: ILocation;
  };
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}
