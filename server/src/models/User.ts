import mongoose from "mongoose";
import Car from "./Car";

interface User extends mongoose.Document {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  license?: {
    number: string;
    images: Buffer[];
  };
  dob: number;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  locale?: string;
  profilePicture?: Buffer;
  domain: Domain[];
  car?: Car;
  location: {
    lat: number;
    long: number;
  };
}

interface Domain {
  id?: string;
  name: string;
  domainID: string;
  startDate: number;
  endDate?: number;
  images?: Buffer[];
}

export default User;
