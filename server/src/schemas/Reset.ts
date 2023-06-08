import mongoose from "mongoose";
import IDb from "../models/interfaces/IDb";
import ResetPassword from "../models/ResetPassword";
import { v4 as uuidv4 } from "uuid";

class ResetModel extends mongoose.Model<ResetPassword> {}

const resetSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: uuidv4(),
  },
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiry: {
    type: Number,
    required: true,
  },
});

const ResetPasswordDB: mongoose.Model<ResetPassword, ResetDBModel> =
  mongoose.model<ResetPassword, ResetModel>("resetPassword", resetSchema);

class ResetDBModel extends IDb<ResetPassword, ResetModel> {
  constructor() {
    super(ResetPasswordDB);
  }
}

export default ResetDBModel;
