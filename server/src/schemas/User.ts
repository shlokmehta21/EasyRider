import mongoose from "mongoose";
import IDb from "../models/interfaces/IDb";
import User from "../models/User";
import { v4 as uuidv4 } from "uuid";

class UserModel extends mongoose.Model<User> {}

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: uuidv4(),
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  license: {
    number: {
      type: String,
    },
    images: {
      type: [Buffer],
    },
  },
  dob: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  createdOn: {
    type: Number,
    default: Date.now(),
  },
  updatedOn: {
    type: Number,
    default: Date.now(),
  },
  domain: [
    {
      id: {
        type: String,
        required: true,
        default: uuidv4(),
      },
      name: {
        type: String,
        required: true,
      },
      domainID: {
        type: String,
        required: true,
      },
      startDate: {
        type: Number,
        required: true,
      },
      endDate: {
        type: Number,
      },
      images: {
        type: [Buffer],
        required: true,
      },
    },
  ],
  car: {
    type: mongoose.Schema.Types.Mixed,
    id: {
      type: String,
      default: uuidv4(),
    },
    name: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    purchasedOn: {
      type: Number,
      required: true,
    },
    images: {
      type: [Buffer],
      required: true,
    },
    carType: {
      type: String,
      required: true,
    },
    plateNo: {
      type: String,
      required: true,
    },
  },
  location: {
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    },
  },
});

const UserDB: mongoose.Model<User, UserModel> = mongoose.model<User, UserModel>(
  "User",
  userSchema
);

class UserDbModel extends IDb<User, UserModel> {
  constructor() {
    super(UserDB);
  }
}

export default UserDbModel;
