import { Request, Response, Router } from "express";
import IController from "../models/interfaces/IController";
import RouteConfig from "../models/interfaces/IRoute";
import routes from "../utils/routesConfig";
import ErrorController from "./Error";
import CheckUserAuthentication from "../middlewares/Auth";
import SessionData from "../models/SessionData";
import UserSession from "../utils/session";
import { validDateChecker } from "../utils/date";
import MyRidesDbModel from "../schemas/MyRides";

class MyRide implements IController {
  router: Router;
  path: RouteConfig = routes.MY_RIDES as RouteConfig;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.use(this.path.default as string, CheckUserAuthentication);

    this.router.post(this.path.default as string, this.getAllMyRides);
  }

  getAllMyRides = async (req: Request, resp: Response): Promise<void> => {
    try {
      const sessionId: string = req.cookies.sessionid as string;
      const { id }: SessionData = new UserSession().getSessionData(sessionId);
      if (!id) {
        new ErrorController().handleError(
          { code: 401, message: "UnAuthorized Request" },
          req,
          resp
        );
        return;
      }
      const { isCompleted, pickUpDateTime, dropOffDateTime }: MyRideRequest =
        req.body;
      const searchObj: any = {
        userId: id,
      };
      const error: { [key: string]: string } = {};
      if (isCompleted) {
        if (typeof isCompleted !== "number") {
          error.isCompleted = "Invalid Input";
        } else {
          searchObj["isCompleted"] = isCompleted > 0 ? 1 : 0;
        }
      }

      if (pickUpDateTime) {
        if (!validDateChecker(pickUpDateTime)) {
          error.pickUpDateTime = "Invalid Pickup Date";
        } else {
          searchObj["pickUpDateTime"] = pickUpDateTime;
        }
      }
      if (dropOffDateTime) {
        if (!validDateChecker(dropOffDateTime)) {
          error.dropOffDateTime = "Invalid Dropoff Date";
        } else {
          searchObj["dropOffDateTime"] = pickUpDateTime;
        }
      }

      if (Object.keys(error).length > 0) {
        new ErrorController().handleError(
          {
            code: 400,
            customMessage: error,
          },
          req,
          resp
        );
        return;
      }

      const db = new MyRidesDbModel();
      const myRide = await db.getModel().find(searchObj, {
        userId: 1,
        carId: 1,
        noOfSeats: 1,
        seatsLeft: 1,
        rideId: 1,
        "pickUp.location.coordinates": 1,
        "pickUp.location.name": 1,
        "dropOff.location.coordinates": 1,
        "dropOff.location.name": 1,
        "pickUp.time": 1,
        "dropOff.time": 1,
        id: 1,
        _id: 0,
        updatedAt: 1,
      });
      resp.status(200).json(myRide || []);
    } catch (error) {
      console.error("An error occurred while fetching ride details:", error);
      new ErrorController().handleInternalServer(resp);
    }
  };
}

interface MyRideRequest {
  id: string;
  isCompleted: number;
  pickUpDateTime: Date;
  dropOffDateTime: Date;
}

export default MyRide;
