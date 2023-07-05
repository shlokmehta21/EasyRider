import express from "express";
import * as bodyParser from "body-parser";
import IController from "./models/interfaces/IController";
import path from "path";
import SanitizeInput from "./middlewares/sanitizeInput";
import "./db/db";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Array<IController>, port: number) {
    this.app = express();
    this.port = port;

    //
    this.initalizeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initalizeMiddlewares() {
    this.app.use(SanitizeInput);
    this.app.use(express.static(path.join(__dirname, "../public")));
    this.app.use(
      bodyParser.json({
        limit: "20mb",
      })
    );
    this.app.use(bodyParser.urlencoded({ extended: true }));
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
