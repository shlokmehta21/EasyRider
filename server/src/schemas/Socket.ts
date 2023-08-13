import mongoose from "mongoose";
import IDb from "../models/interfaces/IDb";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "../models/Socket";

class SocketModel extends mongoose.Model<Socket> {}

const socketSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: uuidv4(),
  },
  socketId: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isAlive: {
    type: Number,
    default: 0,
  },
});

const SocketDB: mongoose.Model<Socket, SocketModel> = mongoose.model<
  Socket,
  SocketModel
>("socket", socketSchema);

class SocketDBModel extends IDb<Socket, SocketModel> {
  constructor() {
    super(SocketDB);
  }
}

export default SocketDBModel;
