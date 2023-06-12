import express, { Request, Response } from "express";
import moment from "moment";
import IController from "../models/interfaces/IController";
import User from "../models/User";
import { registerErrorLabels } from "../utils/label";
import { regex } from "../utils/regex";
import routes from "../utils/routesConfig";
import ErrorController from "./error";
import bcrypt from "bcrypt";
import UserDbModel from "../schemas/User";

class RegisterController implements IController {
  router: express.Router = express.Router();
  path: string = routes.REGISTER as string;

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes = (): void => {
    this.router.post(this.path, this.registerUser);
  };

  registerUser = async (req: Request, resp: Response): Promise<void> => {
    const user: User = req.body;
    const error: { [key: string]: string } = {};

    // firstName validation
    if (!user.firstName) {
      error.firstName = "First Name is required";
    } else if (user.firstName.length <= 2) {
      error.firstName = "First Name must contain 3 chars";
    } else if (
      !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(user.firstName)
    ) {
      error.firstName = "First Name must start with a letter.";
    }

    // lastName validation
    if (!user.lastName) {
      error.lastName = "Last Name is required";
    } else if (user.lastName.length <= 2) {
      error.lastName = "Last Name must contain 3 chars";
    } else if (
      !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(user.lastName)
    ) {
      error.lastName = "Last Name must start with a letter";
    }

    // Email validation
    if (!user.email) {
      error.email = "Email ID is required";
    } else if (!regex.EMAIL.test(user.email)) {
      error.email = "Invalid Email ID";
    }

    // dob validation
    if (!user.dob) {
      error.dob = "Date of Birth is required";
    } else if (!this.validDateChecker(user.dob)) {
      error.dob = "Date of Birth is Invalid";
    }

    // password validation
    if (!user.password) {
      error.password = "Password is required";
    } else {
      if (user.password.length < 6) {
        error.password = "Password must be at least 6 characters long";
      } else if (!/[a-z]/.test(user.password)) {
        error.password = "Password must contain at least one lowercase letter";
      } else if (!/[A-Z]/.test(user.password)) {
        error.password = "Password must contain at least one uppercase letter";
      } else if (!/\d/.test(user.password)) {
        error.password = "Password must contain at least one number";
      } else if (!/[@$!%*?&]/.test(user.password)) {
        error.password =
          "Password must contain at least one special character (@, $, !, %, *, ?, &)";
      } else if (!regex.PASSWORD.test(user.password)) {
        error.password = "Password must meet all the requirements";
      } else {
        if (user.password !== user.confirmPassword) {
          error.confirmPassword = "Password must match";
        } else {
          // Hash the password
          const hashedPassword = await bcrypt.hash(user.password, 10);
          // Update the user object with the hashed password
          user.password = hashedPassword;
        }
      }
    }

    // license validation
    if (user.license && Object.keys(user.license).length > 0) {
      if (!user.license.number) {
        error.licenseNo = "License is required";
      }
      if (
        !user.license.images ||
        (user.license.images && user.license.images.length < 1)
      ) {
        error.licenseImage = "License Image is required";
      }
    }

    // domain validation
    if (!user.domain || user.domain.length < 1) {
      error.domain = "Organisation/Institution name is required";
    } else {
      const domainDetails = user.domain[0];
      if (!domainDetails) {
        error.domain = "Domain Details is required";
      } else {
        // domain name validation
        if (!domainDetails.name) {
          error.domainName = "Name is required";
        } else if (domainDetails.name.length <= 2) {
          error.domainName = "Name must contain 3 chars";
        } else if (
          !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(domainDetails.name)
        ) {
          error.domainName = "Name must be Alphanumeric";
        }

        // domain ID validation
        if (!domainDetails.domainID) {
          error.domainID = "Organisation/Institution ID is required";
        }

        // domain start date validation
        if (!domainDetails.startDate) {
          error.domainStartDate = "Start Date is required";
        } else if (!this.validDateChecker(domainDetails.startDate)) {
          error.domainStartDate = "Start Date is Invalid";
        }

        // domain end date validation
        if (
          domainDetails.endDate &&
          !this.validDateChecker(domainDetails.endDate)
        ) {
          error.domainEndDate = "End Date is Invalid";
        }

        // domain images validation
        if (domainDetails.images && domainDetails.images.length < 2) {
          error.domainIDImages = "Front and Back side images are required";
        }
      }
    }

    try {
      if (Object.keys(error).length > 0) {
        console.log("Invalid Input", error);
        throw new Error("Invalid Input");
      }
      const db = new UserDbModel();
      const isUserExists: boolean = await db.findIfExists({
        email: user.email,
      });
      if (isUserExists) {
        new ErrorController().handleError(
          {
            code: 500,
            message: registerErrorLabels.USER_ALREADY_EXISTS,
          },
          req,
          resp
        );
        return;
      }
      console.log(db.getModel().create(), user);

      const result = await db.getModel().create(user);

      if (result instanceof Error) {
        new ErrorController().handleError(
          {
            code: 500,
            message: "Error Occurred while creating user",
          },
          req,
          resp
        );
        return;
      }

      resp.status(200).json(true);
    } catch (err) {
      console.log(err);
      new ErrorController().handleError(
        {
          code: 500,
          message: "Internal server error",
        },
        req,
        resp
      );
    }
  };

  validDateChecker(date: number): boolean {
    try {
      return moment(date).isValid();
    } catch (err) {
      return false;
    }
  }
}

export default RegisterController;
