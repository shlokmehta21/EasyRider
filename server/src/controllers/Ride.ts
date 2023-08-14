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
import { validDateChecker } from "../utils/date";
import MyRidesDbModel from "../schemas/MyRides";

class Ride implements IController {
  router: Router;
  path: RouteConfig = routes.RIDE as RouteConfig;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.use(this.path.default as string, CheckUserAuthentication);

    this.router.post(this.path.default as string, this.findAllRides);

    this.router.get(this.path.rideDetails as string, this.getRideDetails);
    this.router.post(this.path.add as string, this.add);
    this.router.put(this.path.default as string, this.update);
    this.router.delete(this.path.delete as string, this.delete);
    this.router.post(this.path.book as string, this.book);
    this.router.post(this.path.cancel as string, this.cancel);
  }

  findAllRides = async (req: Request, resp: Response): Promise<void> => {
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
          location: ILocation;
          time: Date;
          filter: string;
        };
        dropOff: {
          location: ILocation;
          time: Date;
          filter: string;
        };
        seatsRequired?: number;
        pageIndex: number;
        itemsPerPage: number;
        total: number;
      } = req.body;
      const error: { [key: string]: string } = {};

      if (typeof pageIndex !== "number" || pageIndex < 0) {
        error.pageIndex = "Page Index must be a number";
      }
      if (
        seatsRequired &&
        (typeof seatsRequired !== "number" || seatsRequired < 0)
      ) {
        error.pageIndex = "Seats Required must be valid";
      }

      if (
        !pickUp ||
        typeof pickUp !== "object" ||
        typeof pickUp.location !== "object" ||
        typeof pickUp.location.coordinates !== "object" ||
        pickUp.location.coordinates.length !== 2 ||
        typeof pickUp.location.coordinates[0] !== "number" ||
        typeof pickUp.location.coordinates[1] !== "number"
      ) {
        error.pickUp = "Invalid Pickup Location";
      } else if (pickUp.time && !validDateChecker(pickUp.time)) {
        error.pickUpTime = "Invalid Pickup Time";
      }
      if (
        !dropOff ||
        typeof dropOff !== "object" ||
        typeof dropOff.location !== "object" ||
        typeof dropOff.location.coordinates !== "object" ||
        dropOff.location.coordinates.length !== 2 ||
        typeof dropOff.location.coordinates[0] !== "number" ||
        typeof dropOff.location.coordinates[1] !== "number"
      ) {
        error.dropOff = "Invalid Dropoff Location";
      } else if (dropOff.time && !validDateChecker(dropOff.time)) {
        error.dropOffTime = "Invalid Dropoff Time";
      }
      if (Object.keys(error).length > 0) {
        new ErrorController().handleError(
          { code: 400, customMessage: error },
          req,
          resp
        );
        return;
      }

      const db = new RideDbModel();

      let matchFilter: any = { isAvailable: true };

      if (pickUp.time) {
        const time = new Date(pickUp.time);
        if (pickUp.filter === "lte") {
          matchFilter["pickUp.time"] = { $lte: time };
        } else {
          matchFilter["pickUp.time"] = { $gte: time };
        }
      }
      if (dropOff.time) {
        const time = new Date(pickUp.time);
        if (pickUp.filter === "lte") {
          matchFilter["dropOff.time"] = { $lte: time };
        } else {
          matchFilter["dropOff.time"] = { $gte: time };
        }
      }
      if (seatsRequired) {
        matchFilter.seatsLeft = { $gte: seatsRequired };
      }

      const aggregationPipeline: any[] = [];

      // Add $geoNear stage for pickUp location
      matchFilter["pickUp.location"] = {
        $geoWithin: {
          $centerSphere: [pickUp.location.coordinates, 250000 / 6371000], // 25000 meters in radians
        },
      };

      // Add the $match stage to filter dropOff location
      if (
        dropOff.location &&
        dropOff.location.coordinates &&
        dropOff.location.coordinates.length === 2
      ) {
        matchFilter["dropOff.location"] = {
          $geoWithin: {
            $centerSphere: [dropOff.location.coordinates, 250000 / 6371000], // 5000 meters in radians
          },
        };
      }

      // Add the rest of the stages
      aggregationPipeline.push(
        { $match: matchFilter },
        { $sort: { updatedAt: -1 } }
      );

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
      aggregationPipeline.push({
        $project: {
          data: {
            seatsLeft: 1,
            "pickUp.location.coordinates": 1,
            "dropOff.location.coordinates": 1,
            "pickUp.time": 1,
            "pickUp.location.name": 1,
            "dropOff.location.name": 1,
            "dropOff.time": 1,
            id: 1,
          },
          totalCount: 1,
        },
      });

      const result = await db.getModel().aggregate(aggregationPipeline);
      console.log(result);

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
  };

  getRideDetails = async (req: Request, resp: Response): Promise<void> => {
    try {
      const { id }: { id: string } = req.params as { id: string };
      if (!id) {
        new ErrorController().handleInvalidRequest(resp);
        return;
      }

      const db = new RideDbModel();
      const ride = await db.getModel().findOne(
        { id },
        {
          userId: 1,
          carId: 1,
          noOfSeats: 1,
          seatsLeft: 1,
          "pickUp.location.coordinates": 1,
          "pickUp.location.name": 1,
          "dropOff.location.coordinates": 1,
          "dropOff.location.name": 1,
          "pickUp.time": 1,
          "dropOff.time": 1,
          id: 1,
          _id: 0,
          updatedAt: 1,
        }
      );

      if (ride) {
        resp.status(200).json(ride);
      } else {
        new ErrorController().handleNotFoundError(resp, "Ride not found");
      }
    } catch (error) {
      console.error("An error occurred while fetching ride details:", error);
      new ErrorController().handleInternalServer(resp);
    }
  };

  add = async (req: Request, resp: Response): Promise<void> => {
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
    const rideData: RideModel = req.body;
    await this.rideInputValidation(rideData).then((error) => {
      if (Object.keys(error).length > 0) {
        new ErrorController().handleError(
          { code: 400, customMessage: error },
          req,
          resp
        );
        return;
      }
    });

    try {
      // Save the new ride to the database
      const db = new RideDbModel();
      await db.getModel().create({ ...rideData, userId: id });
      resp.status(200).json(true);
    } catch (error) {
      console.error("An error occurred while adding the ride:", error);
      new ErrorController().handleError(
        { code: 400, message: "Failed to add ride" },
        req,
        resp
      );
    }
  };

  update = async (req: Request, resp: Response): Promise<void> => {
    const sessionId: string = req.cookies.sessionid as string;
    const { id: userId }: SessionData = new UserSession().getSessionData(
      sessionId
    );
    if (!userId) {
      new ErrorController().handleError(
        { code: 401, message: "UnAuthorized Request" },
        req,
        resp
      );
      return;
    }

    try {
      const rideData: RideModel = req.body;
      await this.rideUpdateValidation(rideData).then((error) => {
        if (Object.keys(error).length > 0) {
          new ErrorController().handleError(
            { code: 400, customMessage: error },
            req,
            resp
          );
          return;
        }
      });

      const db = new RideDbModel();
      db.findIfExists({ id: rideData.id }).then(async (valid: boolean) => {
        if (!valid) {
          new ErrorController().handleError(
            { code: 400, message: "Invalid Ride ID" },
            req,
            resp
          );
          return;
        }
        const isValid = await db.findByParamsAndUpdate(
          { id: rideData.id },
          rideData
        );

        if (!isValid) {
          new ErrorController().handleError(
            { code: 400, message: "Unable to update the ride" },
            req,
            resp
          );
        } else {
          resp.status(200).json(true);
        }
      });
    } catch (error) {
      console.error("An error occurred while updating the ride:", error);
      new ErrorController().handleInternalServer(resp);
    }
  };

  delete = async (req: Request, resp: Response): Promise<void> => {
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
      const deletedRide = await db.getModel().findOneAndDelete({ id });

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
  };

  book = async (req: Request, resp: Response): Promise<void> => {
    try {
      const sessionid: string = req.cookies.sessionid as string;
      const { id, email }: SessionData = new UserSession().getSessionData(
        sessionid
      );
      if (!id) {
        new ErrorController().handleError(
          { code: 401, message: "UnAuthorized Request" },
          req,
          resp
        );
        return;
      }
      const rideData: RideRequest = req.body;
      await this.rideRequestValidation(rideData).then((error) => {
        if (Object.keys(error).length > 0) {
          new ErrorController().handleError(
            { code: 400, customMessage: error },
            req,
            resp
          );
          return;
        }
      });

      let db = new RideDbModel();
      await db
        .getModel()
        .findOne({ id: rideData.id })
        .then(async (ride: RideModel | null) => {
          console.log(ride, ride?.seatsLeft, rideData.noOfSeats, "asdf");
          if (ride && ride.seatsLeft >= rideData.noOfSeats) {
            const updatedSeatCount = ride.seatsLeft - rideData.noOfSeats;
            await db.getModel().findOneAndUpdate(
              { id: rideData.id },
              {
                updatedAt: new Date().toISOString(),
                seatsLeft: updatedSeatCount,
                isAvailable: updatedSeatCount !== 0,
              }
            );
          } else {
            new ErrorController().handleError(
              { code: 409, message: "Ride has been booked" },
              req,
              resp
            );
            return;
          }
          const myRideDb = new MyRidesDbModel();
          await myRideDb.getModel().create({
            rideId: rideData.id,
            carId: rideData.carId,
            userId: ride.userId,
            noOfSeats: rideData.noOfSeats,
            pickUp: rideData.pickUp,
            dropOff: rideData.dropOff,
          });
          resp.status(200).json(true);
        });
    } catch (err) {
      console.log(err);
      new ErrorController().handleInternalServer(resp);
    }
  };

  cancel = async (req: Request, resp: Response): Promise<void> => {
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
    } catch (error) {
      console.error("An error occurred while cancelling the ride:", error);
      new ErrorController().handleInternalServer(resp);
    }
  };

  async rideInputValidation(
    rideData: RideModel
  ): Promise<{ [key: string]: string }> {
    const error: { [key: string]: string } = {};

    // Validate rideData
    if (typeof rideData.carId !== "string") {
      error.carId = "Invalid Car ID";
    } else {
      const db = new UserDbModel();
      await db
        .findOneByParams({ "car.id": rideData.carId })
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
        .catch((err) => {
          error.errors = "Internal server error occurred";
          return;
        });
    }

    if (
      !rideData.pickUp ||
      typeof rideData.pickUp !== "object" ||
      typeof rideData.pickUp.location !== "object" ||
      typeof rideData.pickUp.location.coordinates !== "object" ||
      rideData.pickUp.location.coordinates.length !== 2 ||
      typeof rideData.pickUp.location.coordinates[0] !== "number" ||
      typeof rideData.pickUp.location.coordinates[1] !== "number"
    ) {
      error.pickUp = "Invalid Pickup Location";
    } else if (!validDateChecker(rideData.pickUp.time)) {
      error.pickUpTime = "Invalid Pickup Time";
    } else if (!rideData.pickUp.location.name) {
      error.pickUpLocName = "Invalid Pickup Location";
    }

    if (
      !rideData.dropOff ||
      typeof rideData.dropOff !== "object" ||
      typeof rideData.dropOff.location !== "object" ||
      typeof rideData.dropOff.location.coordinates !== "object" ||
      rideData.dropOff.location.coordinates.length !== 2 ||
      typeof rideData.dropOff.location.coordinates[0] !== "number" ||
      typeof rideData.dropOff.location.coordinates[1] !== "number"
    ) {
      error.dropOff = "Invalid Dropoff Location";
    } else if (!validDateChecker(rideData.dropOff.time)) {
      error.dropOffTime = "Invalid Dropoff Time";
    } else if (!rideData.dropOff.location.name) {
      error.dropOffLocName = "Invalid Dropoff Location";
    }
    return error;
  }

  async rideUpdateValidation(
    rideData: RideModel
  ): Promise<{ [key: string]: string }> {
    const error: { [key: string]: string } = {};

    // Validate rideData
    if (!rideData.id || typeof rideData.id !== "string") {
      error.id = "Invalid Ride ID";
    }
    if (rideData.carId && typeof rideData.carId !== "string") {
      error.carId = "Invalid Car ID";
    } else {
      const db = new UserDbModel();
      await db
        .findOneByParams({ "car.id": rideData.carId })
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
        .catch((err) => {
          error.errors = "Internal server error occurred";
          return;
        });
    }

    if (
      rideData.pickUp &&
      (typeof rideData.pickUp !== "object" ||
        typeof rideData.pickUp.location !== "object" ||
        typeof rideData.pickUp.location.coordinates !== "object" ||
        rideData.pickUp.location.coordinates.length !== 2 ||
        typeof rideData.pickUp.location.coordinates[0] !== "number" ||
        typeof rideData.pickUp.location.coordinates[1] !== "number")
    ) {
      error.pickUp = "Invalid Pickup Location";
    } else if (
      rideData.pickUp &&
      rideData.pickUp.time &&
      !validDateChecker(rideData.pickUp.time)
    ) {
      error.pickUpTime = "Invalid Pickup Time";
    } else if (
      rideData.pickUp &&
      rideData.pickUp.location &&
      !rideData.pickUp.location.name
    ) {
      error.pickUpLocName = "Invalid Pickup Location";
    }

    if (
      rideData.dropOff &&
      (typeof rideData.dropOff !== "object" ||
        typeof rideData.dropOff.location !== "object" ||
        typeof rideData.dropOff.location.coordinates !== "object" ||
        rideData.dropOff.location.coordinates.length !== 2 ||
        typeof rideData.dropOff.location.coordinates[0] !== "number" ||
        typeof rideData.dropOff.location.coordinates[1] !== "number")
    ) {
      error.dropOff = "Invalid Dropoff Location";
    } else if (
      rideData.dropOff &&
      rideData.dropOff.time &&
      !validDateChecker(rideData.dropOff.time)
    ) {
      error.dropOffTime = "Invalid Dropoff Time";
    } else if (
      rideData.dropOff &&
      rideData.dropOff.location &&
      !rideData.dropOff.location.name
    ) {
      error.dropOffLocName = "Invalid Dropoff Location";
    }
    return error;
  }

  async rideRequestValidation(
    rideData: RideRequest
  ): Promise<{ [key: string]: string }> {
    const error: { [key: string]: string } = {};

    // Validate rideData
    if (typeof rideData.id !== "string") {
      error.carId = "Invalid Ride ID";
    } else {
      const db = new RideDbModel();
      await db
        .findOneByParams({ id: rideData.id })
        .then((ride: RideModel | null) => {
          if (!ride) {
            error.id = "Invalid Ride ID";
          } else {
            if (
              typeof rideData.noOfSeats !== "number" ||
              rideData.noOfSeats <= 0 ||
              !Number.isInteger(rideData.noOfSeats)
            ) {
              error.noOfSeats = "Invalid Number of Seats";
            } else if (rideData.noOfSeats > (ride.seatsLeft as number)) {
              error.noOfSeats = `No Seats Available`;
            }
          }
        });
    }
    if (typeof rideData.carId !== "string") {
      error.carId = "Invalid Car ID";
    } else {
      const db = new UserDbModel();
      await db
        .findOneByParams({ "car.id": rideData.carId })
        .then((user: User | null) => {
          if (!user) {
            error.carId = "Invalid Car ID";
          }
        })
        .catch((err) => {
          error.errors = "Internal server error occurred";
          return;
        });
    }

    if (
      !rideData.pickUp ||
      typeof rideData.pickUp !== "object" ||
      typeof rideData.pickUp.location !== "object" ||
      typeof rideData.pickUp.location.coordinates !== "object" ||
      rideData.pickUp.location.coordinates.length !== 2 ||
      typeof rideData.pickUp.location.coordinates[0] !== "number" ||
      typeof rideData.pickUp.location.coordinates[1] !== "number"
    ) {
      error.pickUp = "Invalid Pickup Location";
    } else if (!rideData.pickUp.location.name) {
      error.pickUpLocName = "Invalid Pickup Location";
    }

    if (
      !rideData.dropOff ||
      typeof rideData.dropOff !== "object" ||
      typeof rideData.dropOff.location !== "object" ||
      typeof rideData.dropOff.location.coordinates !== "object" ||
      rideData.dropOff.location.coordinates.length !== 2 ||
      typeof rideData.dropOff.location.coordinates[0] !== "number" ||
      typeof rideData.dropOff.location.coordinates[1] !== "number"
    ) {
      error.dropOff = "Invalid Dropoff Location";
    } else if (!rideData.dropOff.location.name) {
      error.dropOffLocName = "Invalid Dropoff Location";
    }
    return error;
  }
}

interface RideRequest {
  id: string;
  carId: string;
  userId: string;
  noOfSeats: number;
  pickUp: {
    location: ILocation;
  };
  dropOff: {
    location: ILocation;
  };
}

export default Ride;
