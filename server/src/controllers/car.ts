import express, { Request, Response, Router } from "express";
import IController from "../models/interfaces/IController";
import routes from "../utils/routesConfig";
import CarType from "../models/Car";
import { regex } from "../utils/regex";
import moment from "moment";

class Car implements IController {
  router: Router = Router();
  path: string = routes.CAR as string;

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.post(`${this.path}/register/`, this.registerCar);
  }

  registerCar(req: Request, resp: Response): void {
    const car: CarType = req.body;
    const error: { [key: string]: string } =
      this.handleUserInputValidation(car);
    if (Object.keys(error).length > 0) {
      resp.status(400).json({ error });
    } else {
      // Save the car to the database or perform other operations
      resp.status(200);
    }
  }

  handleUserInputValidation(car: CarType): { [key: string]: string } {
    const error: { [key: string]: string } = {};

    // Name validation
    if (!car.name) {
      error.carName = "Name is required";
    } else if (car.name.length < 3) {
      error.carName = "Name must contain at least 3 characters";
    } else if (!regex.ALPHANUMERIC.test(car.name)) {
      error.carName = "Name must be alphanumeric";
    }

    // Model validation
    if (!car.model) {
      error.carModel = "Model is required";
    } else if (car.model.length < 3) {
      error.carModel = "Model must contain at least 3 characters";
    } else if (!regex.ALPHANUMERIC.test(car.model)) {
      error.carModel = "Model must be alphanumeric";
    }

    // Plate Number validation
    if (!car.plateNo) {
      error.plateNo = "Plate Number is required";
    } else if (!regex.ALPHANUMERIC.test(car.plateNo)) {
      error.plateNo = "Plate Number must be alphanumeric";
    }

    // Purchased On validation
    if (!car.purchasedOn) {
      error.purchasedOn = "Purchased On is required";
    } else if (!this.validDateChecker(car.purchasedOn)) {
      error.purchasedOn = "Purchased On is invalid";
    }

    // Images validation
    if (car.images && car.images.length > 0) {
      if (car.images.length > 6) {
        error.carImages = "Cannot upload more than 6 images";
      }
    }

    // Type validation
    if (car.type) {
      if (car.type.length < 3) {
        error.type = "Type must contain at least 3 characters";
      } else if (!regex.ALPHANUMERIC.test(car.type)) {
        error.type = "Type must be alphanumeric";
      }
    }

    return error;
  }

  validDateChecker(date: number): boolean {
    try {
      return moment(date).isValid();
    } catch {
      return false;
    }
  }
}

export default Car;
