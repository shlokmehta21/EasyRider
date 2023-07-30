import { Document } from "mongoose";
import { ILocation } from "./Location";

export interface Ride extends Document {
  id: string;
  userId: string;
  carId: string;
  noOfSeats: number;
  seatsLeft: number;
  pickUp: {
    location: ILocation;
    time: Date;
  };
  dropOff: {
    location: ILocation;
    time: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
}
