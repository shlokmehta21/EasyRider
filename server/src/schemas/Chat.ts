import mongoose from "mongoose";
import IDb from "../models/interfaces/IDb";
import { v4 as uuidv4 } from "uuid";
import { Chat } from "../models/Chat";

class ChatModel extends mongoose.Model<Chat> {}

const chatSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    default: uuidv4(),
  },
  receiver: {
    type: String,
    required: true,
  },
  rideId: {
    type: String,
    required: true,
  },
  message: {
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
  delievered: {
    type: Number,
    default: 0,
  },
  read: {
    type: Number,
    default: 0,
  },
});

const ChatDB: mongoose.Model<Chat, ChatModel> = mongoose.model<Chat, ChatModel>(
  "chat",
  chatSchema
);

class ChatDBModel extends IDb<Chat, ChatModel> {
  constructor() {
    super(ChatDB);
  }
}

export default ChatDBModel;
