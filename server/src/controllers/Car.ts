import { Request, Response, Router } from "express";
import IController from "../models/interfaces/IController";
import routes from "../utils/routesConfig";
import CarType from "../models/Car";
import { regex } from "../utils/regex";
import RouteConfig from "../models/interfaces/IRoute";
import CheckUserAuthentication from "../middlewares/Auth";
import UserDbModel from "../schemas/User";
import User from "../models/User";
import UserSession from "../utils/session";
import ErrorController from "./Error";
import { validDateChecker } from "../utils/date";
import { readFileSync } from "fs";
import path from "path";
import SessionData from "../models/SessionData";
import { v4 as uuidv4 } from "uuid";

class Car implements IController {
  router: Router;
  path: RouteConfig = routes.CAR as RouteConfig;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.use(this.path.default as string, CheckUserAuthentication);
    this.router.get(this.path.default as string, this.getAllMyCarDetails);
    this.router.post(this.path.default as string, this.getCarDetails);
    this.router.post(this.path.register as string, this.register);
    this.router.delete(this.path.delete as string, this.delete);
  }
  getAllMyCarDetails = async (req: Request, resp: Response): Promise<void> => {
    try {
      const sessionId = req.cookies.sessionid as string;
      const { id }: SessionData = new UserSession().getSessionData(sessionId);

      if (!id) {
        new ErrorController().handleError(
          { code: 400, message: "Invalid User Session" },
          req,
          resp
        );
        return;
      }
      const db = new UserDbModel();
      const car = await db.getModel().findOne(
        { id },
        {
          _id: 0,
          id: 1,
          "car.id": 1,
          "car.name": 1,
          "car.model": 1,
          "car.carType": 1,
          "car.seatsAvailable": 1,
        }
      );
      if (car) {
        resp.status(200).json(car);
      } else {
        new ErrorController().handleError(
          { code: 400, message: "User Not Found" },
          req,
          resp
        );
      }
    } catch (err) {
      console.log(err);
      new ErrorController().handleInternalServer(resp);
    }
  };

  getCarDetails = async (req: Request, resp: Response): Promise<void> => {
    try {
      const sessionId = req.cookies.sessionid as string;
      const { id: sessionUserId }: SessionData =
        new UserSession().getSessionData(sessionId);

      if (!sessionUserId) {
        new ErrorController().handleError(
          { code: 400, message: "Invalid User session" },
          req,
          resp
        );
        return;
      }

      const { userId, id }: { userId: string; id: string } = req.body as {
        userId: string;
        id: string;
      };
      const error: { [key: string]: string } = {};
      if (!id) {
        error.id = "Car ID is required";
      }
      if (!userId) {
        error.userId = "User ID is required";
      }
      if (Object.keys(error).length > 0) {
        new ErrorController().handleError(
          { code: 400, customMessage: error },
          req,
          resp
        );
        return;
      }

      const db = new UserDbModel();
      const car = await db.getModel().findOne(
        { id: userId, "car.id": id },
        {
          id: 1,
          car: 1,
        }
      );
      if (car) {
        resp.status(200).json(car);
      } else {
        new ErrorController().handleError(
          { code: 400, message: "User/Car Not Found" },
          req,
          resp
        );
      }
    } catch (err) {
      new ErrorController().handleInternalServer(resp);
    }
  };

  async delete(req: Request, resp: Response): Promise<void> {
    try {
      const { id }: { id: string } = req.params as { id: string };
      if (!id) {
        new ErrorController().handleError(
          { code: 401, message: "Invalid Request" },
          req,
          resp
        );
        return;
      }
      const db = new UserDbModel();
      const user: User = (await db.findOneByParams({
        "car.id": id,
      })) as User;
      if (user && user.car) {
        db.findOneByParamsAndUnsetObject({ "car.id": id })
          .then((foundDoc: any) => {
            if (foundDoc) {
              resp.status(200).json(true);
            } else {
              resp.status(401).json({ message: "Car ID not found" });
            }
          })
          .catch((err: any) => {
            new ErrorController().handleError(
              { code: 500, message: "Server Error Occurred" },
              req,
              resp
            );
          });
      } else {
        if (!user && !id) {
          new ErrorController().handleError(
            { code: 400, message: "User Doesn't Exist" },
            req,
            resp
          );
        } else {
          new ErrorController().handleError(
            { code: 400, message: "User Car Doesn't Exist" },
            req,
            resp
          );
        }
      }
    } catch (err) {
      console.log(err);
      new ErrorController().handleError(
        { code: 500, message: "Server Error Occurred" },
        req,
        resp
      );
    }
  }

  register = async (req: Request, resp: Response): Promise<void> => {
    const car: CarType = req.body;

    const buffer = readFileSync(
      path.join(__dirname, "../asset/img/bottle.png")
    );
    car.images = [buffer, buffer];

    const error: { [key: string]: string } =
      this.handleUserInputValidation(car);
    if (Object.keys(error).length > 0) {
      new ErrorController().handleError(
        { code: 400, customMessage: error },
        req,
        resp
      );
      return;
    } else {
      const db = new UserDbModel();
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

      db.findByParamsAndUpdate({ id }, { car: { id: uuidv4(), ...car } }).then(
        (isUpdated: boolean) => {
          if (!isUpdated) {
            new ErrorController().handleError(
              { code: 500, message: "Failed to register Car" },
              req,
              resp
            );
          } else {
            // Save the car to the database or perform other operations
            resp.status(200).send(true);
          }
        }
      );
    }
  };

  handleUserInputValidation(car: CarType): { [key: string]: string } {
    const error: { [key: string]: string } = {};

    // Name validation
    if (!car.name) {
      error.carName = "Name is required";
    } else if (car.name.length < 3) {
      error.carName = "Name must contain at least 3 characters";
    } else if (!regex.CONTAINS_ALPHANUMERIC.test(car.name)) {
      error.carName = "Name must be alphanumeric";
    }
    // Model validation
    if (!car.model) {
      error.carModel = "Model is required";
    } else if (car.model.length < 3) {
      error.carModel = "Model must contain at least 3 characters";
    } else if (!regex.CONTAINS_ALPHANUMERIC.test(car.model)) {
      error.carModel = "Model must be alphanumeric";
    }

    if (!car.seatsAvailable) {
      error.seatsAvailable = "Available Seats is required";
    } else {
      if (typeof car.seatsAvailable !== "number") {
        error.seatsAvailable = "Seats Available must be a number";
      }
    }

    // Plate Number validation
    if (!car.plateNo) {
      error.plateNo = "Plate Number is required";
    } else if (!regex.CONTAINS_ALPHANUMERIC.test(car.plateNo)) {
      error.plateNo = "Plate Number must be alphanumeric";
    }

    // Purchased On validation
    if (!car.purchasedOn) {
      error.purchasedOn = "Purchased On is required";
    } else if (!validDateChecker(car.purchasedOn)) {
      error.purchasedOn = "Purchased On is invalid";
    }

    // Images validation
    if (!car.images || car.images.length <= 0) {
      error.carImages = "Car pictures are required";
    } else if (car.images.length > 6) {
      error.carImages = "Cannot upload more than 6 images";
    }

    // Type validation
    if (!regex.CONTAINS_ALPHANUMERIC.test(car.carType)) {
      error.type = "Type must be alphanumeric";
    }
    return error;
  }
}

export default Car;
