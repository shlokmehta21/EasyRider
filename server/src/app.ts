import express, { Application, Router } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import IController from "./models/interfaces/IController";
import path from "path";
import SanitizeInput from "./middlewares/sanitizeInput";
import "./db/db";

class App {
  public app: Application;
  public port: number;

  constructor(controllers: Array<IController>, port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use(cookieParser());

    this.app.use(express.static(path.join(__dirname, "../public")));
    this.app.use(
      bodyParser.json({
        limit: "10mb",
      })
    );
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(SanitizeInput);
  }

  private initializeControllers(controllers: Array<IController>) {
    const router = Router();

    controllers.forEach((controller: IController) => {
      controller.initializeRoutes();
      router.use("/", controller.router);
    });

    this.app.use(router);
  }

  public listen() {
    this.app.listen(this.port, (): void => {
      console.log(`server listening on port ${this.port}`);
    });
  }
}

export default App;
