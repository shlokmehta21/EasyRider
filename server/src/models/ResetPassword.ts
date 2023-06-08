import mongoose from "mongoose";

interface ResetPassword extends mongoose.Document {
  id: string;
  userId: string;
  token: string;
  expiry: number;
}

export default ResetPassword;
