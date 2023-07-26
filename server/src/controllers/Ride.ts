import { Request, Response, Router } from "express";
import IController from "../models/interfaces/IController";
import RouteConfig from "../models/interfaces/IRoute";
import RideDbModel from "../schemas/Ride";
import routes from "../utils/routesConfig";
import { Ride as RideModel } from "../models/Ride";
import ErrorController from "./Error";
import CheckUserAuthentication from "../middlewares/Auth";
import UserDbModel from "../schemas/User";
import User from "../models/User";
import SessionData from "../models/SessionData";
import UserSession from "../utils/session";
import { ILocation } from "../models/Location";

class Ride implements IController {
  router: Router;
  path: RouteConfig = routes.RIDE as RouteConfig;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.use(this.path.default as string, CheckUserAuthentication);

    this.router.get(this.path.default as string, this.findAllRides);

    this.router.get(this.path.rideDetails as string, this.getRideDetails);
    this.router.post(this.path.add as string, this.add);
    this.router.put(this.path.update as string, this.update);
    this.router.delete(this.path.delete as string, this.delete);
    this.router.post(this.path.book as string, this.book);
    this.router.post(this.path.cancel as string, this.cancel);
  }

  async findAllRides(req: Request, resp: Response): Promise<void> {
    try {
      const {
        pickUp,
        dropOff,
        seatsRequired,
        pageIndex = 0,
        itemsPerPage = 10,
        total = -1,
      }: {
        pickUp: {
          lat: number;
          long: number;
          time: Date;
        };
        dropOff: {
          lat: number;
          long: number;
          time: Date;
        };
        pickUpDate?: Date;
        seatsRequired?: number;
        pageIndex: number;
        itemsPerPage: number;
        total: number;
      } = req.body;

      const db = new RideDbModel();

      let matchFilter: any = { isAvailable: true };

      if (pickUp.time) {
        matchFilter.pickUp = { time: pickUp.time };
      }

      if (dropOff.lat && dropOff.long) {
        matchFilter["dropOff.lat"] = dropOff.lat;
        matchFilter["dropOff.long"] = dropOff.long;
      }

      if (dropOff.time) {
        matchFilter.dropOff = { time: dropOff.time };
      }

      const aggregationPipeline: any[] = [
        { $match: matchFilter },
        {
          $geoNear: {
            near: { type: "Point", coordinates: [pickUp.long, pickUp.lat] },
            distanceField: "distance",
            maxDistance: 25000, // distance in meters (25 km)
            spherical: true,
          },
        },
        { $sort: { createdAt: -1 } },
      ];

      if (total > 0) {
        aggregationPipeline.push(
          { $skip: pageIndex * itemsPerPage },
          { $limit: itemsPerPage }
        );
      } else {
        aggregationPipeline.push({
          $facet: {
            totalCount: [{ $count: "total" }],
            data: [
              { $skip: pageIndex * itemsPerPage },
              { $limit: itemsPerPage },
            ],
          },
        });
      }

      const result = await db.getModel().aggregate(aggregationPipeline);

      if (total > 0) {
        const { data } = result[0];
        resp.status(200).json({ data, total });
      } else {
        const { data, totalCount } = result[0];
        const total = totalCount.length > 0 ? totalCount[0].total : 0;
        resp.status(200).json({ data, total });
      }
    } catch (error) {
      console.error("An error occurred while fetching rides:", error);
      resp.status(500).json({ error: "An error occurred" });
    }
  }

  async getRideDetails(req: Request, resp: Response): Promise<void> {
    try {
      const { id }: { id: string } = req.params as { id: string };
      if (!id) {
        new ErrorController().handleInvalidRequest(resp);
        return;
      }

      const db = new RideDbModel();
      const ride = await db.findOneByParams({ id });

      if (ride) {
        resp.status(200).json(ride);
      } else {
        new ErrorController().handleNotFoundError(resp, "Ride not found");
      }
    } catch (error) {
      console.error("An error occurred while fetching ride details:", error);
      new ErrorController().handleInternalServer(resp);
    }
  }

  async add(req: Request, resp: Response): Promise<void> {
    const rideData: RideModel = req.body;
    const error: { [key: string]: string } = this.rideInputValidation(rideData);

    if (Object.keys(error).length > 0) {
      new ErrorController().handleError(
        { code: 400, customMessage: error },
        req,
        resp
      );
      return;
    }

    try {
      // Save the new ride to the database
      const newRide = new RideDbModel(rideData);
      await newRide.save();
      resp.status(200).json(true);
    } catch (error) {
      console.error("An error occurred while adding the ride:", error);
      new ErrorController().handleError(
        { code: 400, message: "Failed to add ride" },
        req,
        resp
      );
    }
  }

  async update(req: Request, resp: Response): Promise<void> {
    const rideData: RideModel = req.body;
    const error: { [key: string]: string } = this.rideInputValidation(rideData);

    if (Object.keys(error).length > 0) {
      new ErrorController().handleError(
        { code: 400, customMessage: error },
        req,
        resp
      );
      return;
    }

    try {
      const db = new RideDbModel();
      const isValid = await db.findByParamsAndUpdate(
        { id: rideData.id },
        rideData
      );

      if (!isValid) {
        new ErrorController().handleError(
          { code: 400, message: "Unable to find the ride to update" },
          req,
          resp
        );
      } else {
        resp.status(200).json(true);
      }
    } catch (error) {
      console.error("An error occurred while updating the ride:", error);
      new ErrorController().handleInternalServer(resp);
    }
  }

  async delete(req: Request, resp: Response): Promise<void> {
    const { id }: { id: string } = req.params as { id: string };

    if (!id || !id.trim()) {
      new ErrorController().handleError(
        { code: 400, message: "Invalid Request" },
        req,
        resp
      );
      return;
    }

    try {
      // Find and delete the ride
      const db = new RideDbModel();
      const deletedRide = await db.getModel().findByIdAndDelete({ id });

      if (!deletedRide) {
        new ErrorController().handleNotFoundError(resp, "Ride not found");
      } else {
        resp.status(200).json(true);
      }
    } catch (error) {
      console.error("An error occurred while deleting the ride:", error);
      new ErrorController().handleError(
        { code: 500, message: "Failed to delete ride" },
        req,
        resp
      );
    }
  }

  async book(req: Request, resp: Response): Promise<void> {
    const sessionid: string = req.cookies.sessionid as string;
    const { id, email }: SessionData = new UserSession().getSessionData(
      sessionid
    );

    const rideData: RideRequest = req.body;

    // TODO: Implement booking logic
  }

  async cancel(req: Request, resp: Response): Promise<void> {
    const { id }: { id: string } = req.params as { id: string };
    if (!id) {
      new ErrorController().handleError(
        { code: 400, message: "Invalid Request Data" },
        req,
        resp
      );
      return;
    }

    try {
      const db = new RideDbModel();

      // TODO: Implement cancel ride logic
    } catch (error) {
      console.error("An error occurred while cancelling the ride:", error);
      new ErrorController().handleInternalServer(resp);
    }
  }

  rideInputValidation(rideData: RideModel): { [key: string]: string } {
    const error: { [key: string]: string } = {};

    // Validate rideData
    if (typeof rideData.userId !== "string" || !rideData.userId.trim()) {
      error.userId = "Invalid User ID";
    } else {
      rideData.userId = rideData.userId.trim();
    }

    if (typeof rideData.carId !== "string" || !rideData.carId.trim()) {
      error.carId = "Invalid Car ID";
    } else {
      rideData.carId = rideData.carId.trim();
      const db = new UserDbModel();
      db.findOneByParams({ "car.id": rideData.carId })
        .then((user: User | null) => {
          if (!user) {
            error.carId = "Invalid Car ID";
          } else {
            if (
              typeof rideData.noOfSeats !== "number" ||
              rideData.noOfSeats <= 0 ||
              !Number.isInteger(rideData.noOfSeats)
            ) {
              error.noOfSeats = "Invalid Number of Seats";
            } else if (
              rideData.noOfSeats > (user.car?.seatsAvailable as number)
            ) {
              error.noOfSeats = `No. of Seats cannot be greater than ${user.car?.seatsAvailable}`;
            }
          }
        })
        .catch((error) => {
          console.error(
            "An error occurred while validating the car ID:",
            error
          );
        });
    }

    if (
      !rideData.pickUp ||
      typeof rideData.pickUp !== "object" ||
      typeof rideData.pickUp.location !== "object" ||
      typeof rideData.pickUp.location.lat !== "number" ||
      typeof rideData.pickUp.location.long !== "number"
    ) {
      error.pickUp = "Invalid Pickup Location";
    }

    if (
      !rideData.dropOff ||
      typeof rideData.dropOff !== "object" ||
      typeof rideData.dropOff.location !== "object" ||
      typeof rideData.dropOff.location.lat !== "number" ||
      typeof rideData.dropOff.location.long !== "number"
    ) {
      error.dropOff = "Invalid Dropoff Location";
    }

    if (
      rideData.isAvailable !== undefined &&
      typeof rideData.isAvailable !== "boolean"
    ) {
      error.isAvailable = "Invalid Availability";
    }

    return error;
  }
}

interface RideRequest {
  id: string;
  carId: string;
  noOfSeats: number;
  pickUp: {
    location: ILocation;
  };
  dropOff: {
    location: ILocation;
  };
}

export default Ride;
