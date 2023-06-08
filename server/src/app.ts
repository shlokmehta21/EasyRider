import express from "express";
import session, { SessionOptions } from "express-session";
import * as bodyParser from "body-parser";
import IController from "./models/interfaces/IController";

class App {
  public app: express.Application;
  public port: number;
  public session: SessionOptions;

  constructor(controllers: Array<IController>, port: number) {
    this.app = express();
    this.port = port;
    this.session = {
      secret: process.env.SECRET_KEY || "group4Capston@easyrider.com",
      saveUninitialized: false,
      resave: false,
    };

    //
    this.initalizeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initalizeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(session(this.session));
  }

  private initializeControllers(controllers: Array<IController>) {
    controllers.forEach((controller: IController) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, (): void => {
      console.log(`server listening on port ${this.port}`);
    });
  }
}

export default App;
