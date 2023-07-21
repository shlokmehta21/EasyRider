import { Request, Response, Router } from "express";
import IController from "../models/interfaces/IController";
import RouteConfig from "../models/interfaces/IRoute";
import routes from "../utils/routesConfig";
import ErrorController from "./Error";
import User from "../models/User";
import UserDbModel from "../schemas/User";
import UserSession from "../utils/session";
import CheckUserAuthentication from "../middlewares/Auth";

class Location implements IController {
  router: Router;
  path: RouteConfig = routes.LOCATION as RouteConfig;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.use(this.path.default as string, CheckUserAuthentication);
    this.router.put(this.path.update as string, this.update);
  }

  update(req: Request, resp: Response): void {
    const { lat, long }: { lat: number; long: number } = req.body;
    const sessionId: string = req.cookies.sessionId as string;
    const data: User = new UserSession().getSessionData(sessionId) as User;

    if (data === null) {
      new ErrorController().handleError(
        { code: 401, message: "Unauthorized Request" },
        req,
        resp
      );
      return;
    }

    // Update the user document with the new location
    const db = new UserDbModel();
    db.getModel().findById({ id: data.id }, (err: Error, user: User) => {
      if (err) {
        // Handle error
        new ErrorController().handleError(
          { code: 500, message: "Failed to update user location" },
          req,
          resp
        );
      }
      if (!user) {
        new ErrorController().handleError(
          { code: 400, message: "User not found" },
          req,
          resp
        );
      }

      // Save the updated user document
      db.getModel().findByIdAndUpdate(
        { id: data.id },
        { location: { lat, long } },
        (err: Error) => {
          if (err) {
            // Handle error
            new ErrorController().handleError(
              { code: 500, message: "Failed to update user location" },
              req,
              resp
            );
          }
          // Return success response
          resp.status(200).json(true);
        }
      );
    });
  }
}

export default Location;
