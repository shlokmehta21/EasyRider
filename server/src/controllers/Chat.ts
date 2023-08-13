import { Router, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import routes from "../utils/routesConfig";
import CheckUserAuthentication from "../middlewares/Auth";
import IController from "../models/interfaces/IController";
import RouteConfig from "../models/interfaces/IRoute";
import ChatDBModel from "../schemas/Chat";
import SocketDBModel from "../schemas/Socket";
import ErrorController from "./Error";

class Chat implements IController {
  router: Router;
  private io: Server; // Socket.IO server instance
  path: RouteConfig = routes.MESSAGE as RouteConfig;

  constructor(io: Server) {
    this.router = Router();
    this.io = io;
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.use(this.path.default as string, CheckUserAuthentication);

    // Endpoint to send a message
    this.router.post(this.path.default as string, this.sendMessage);

    // Endpoint to get unread messages
    // Remove this.router.get(this.path.unread as string, this.getUnreadMessages);

    // Socket.IO connection event
    this.io.on("connection", async (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      const db = new SocketDBModel();
      const existingSocket = await db.getModel().findOne({ userId });

      if (existingSocket) {
        await existingSocket.updateOne({ isAlive: 1 });
        existingSocket.socketId = socket.id;
        await existingSocket.save();
      } else {
        await db.getModel().create({
          userId,
          socketId: socket.id,
          isAlive: 1,
        });
      }

      // Emit unread messages when the user comes online
      const chatDBModel = new ChatDBModel();
      const unreadMessages = await chatDBModel.getModel().find({
        receiver: userId,
        read: 0,
      });

      if (unreadMessages.length > 0) {
        socket.emit("unread-messages", unreadMessages);
      }

      socket.on("disconnect", async () => {
        await db.getModel().updateOne({ userId }, { isAlive: 0 });
      });
    });
  }

  // Function to send a message
  // Function to send a message
  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sender, receiver, rideId, message } = req.body;

      // Validate the required fields
      if (!sender || !receiver || !rideId || !message) {
        new ErrorController().handleError(
          {
            code: 400,
            message: "Sender, receiver, rideId, and message are required.",
          },
          req,
          res
        );
        return;
      }

      // Create and save the chat message to the MongoDB
      const chatDBModel = new ChatDBModel();
      const chat = await chatDBModel.getModel().create({
        sender,
        receiver,
        rideId,
        message,
        delivered: 0,
        read: 0,
      });

      const db = new SocketDBModel();
      const receiverSocket = await db.getModel().findOne({ userId: receiver });

      if (receiverSocket) {
        // Send the message using Socket.IO
        this.io.to(receiverSocket.socketId).emit("receive-chat", chat);
      }

      res.status(200).json(chat);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // Function to get unread messages for a user
  getUnreadMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      // Retrieve unread messages from the MongoDB
      const chatDBModel = new ChatDBModel();
      const unreadMessages = await chatDBModel.getModel().find({
        receiver: req.query.userId,
        read: 0,
      });

      res.status(200).json(unreadMessages);
    } catch (error) {
      console.error("Error getting unread messages:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default Chat;
