import { Request, Response, Router } from "express";
import IController from "../models/interfaces/IController";
import User from "../models/User";
import { registerErrorLabels } from "../utils/label";
import { regex } from "../utils/regex";
import routes from "../utils/routesConfig";
import ErrorController from "./Error";
import bcrypt from "bcrypt";
import UserDbModel from "../schemas/User";
import { validDateChecker } from "../utils/date";
import { readFileSync } from "fs";
import path from "path";

class RegisterController implements IController {
  router: Router;
  path: string = routes.REGISTER as string;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes = (): void => {
    this.router.post(this.path, this.registerUser);
  };

  registerUser = async (req: Request, resp: Response): Promise<void> => {
    const user: User = req.body;
    const error: { [key: string]: string } = {};

    const buffer = readFileSync(
      path.join(__dirname, "../asset/img/bottle.png")
    );
    user.domain[0].images = [buffer, buffer];

    // firstName validation
    if (!user.firstName || !user.firstName.trim()) {
      error.firstName = "First Name is required";
    } else {
      user.firstName = user.firstName.trim();
      if (user.firstName.length <= 2) {
        error.firstName = "First Name must contain 3 chars";
      } else if (
        !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(user.firstName)
      ) {
        error.firstName = "First Name must start with a letter.";
      }
    }
    // lastName validation
    if (!user.lastName || !user.lastName.trim()) {
      error.lastName = "Last Name is required";
    } else {
      user.lastName = user.lastName.trim();

      if (user.lastName.length <= 2) {
        error.lastName = "Last Name must contain 3 chars";
      } else if (
        !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(user.lastName)
      ) {
        error.lastName = "Last Name must start with a letter";
      }
    }

    // Email validation
    if (!user.email || !user.email.trim()) {
      error.email = "Email ID is required";
    } else {
      user.email = user.email.trim();
      if (!regex.EMAIL.test(user.email)) {
        error.email = "Invalid Email ID";
      }
    }

    // dob validation
    if (!user.dob) {
      error.dob = "Date of Birth is required";
    } else if (!validDateChecker(user.dob)) {
      error.dob = "Date of Birth is Invalid";
    }

    // password validation
    if (!user.password || !user.password.trim()) {
      error.password = "Password is required";
    } else {
      user.password = user.password.trim();
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
        if (!domainDetails.name || !domainDetails.name.trim()) {
          error.domainName = "Name is required";
        } else {
          domainDetails.name = domainDetails.name.trim();
          if (domainDetails.name.length <= 2) {
            error.domainName = "Name must contain 3 chars";
          } else if (
            !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(
              domainDetails.name
            )
          ) {
            error.domainName = "Name must be Alphanumeric";
          }
        }

        // domain ID validation
        if (!domainDetails.domainID) {
          error.domainID = "Organisation/Institution ID is required";
        }

        // domain start date validation
        if (!domainDetails.startDate) {
          error.domainStartDate = "Start Date is required";
        } else if (!validDateChecker(domainDetails.startDate)) {
          error.domainStartDate = "Start Date is Invalid";
        }

        // domain end date validation
        if (domainDetails.endDate && !validDateChecker(domainDetails.endDate)) {
          error.domainEndDate = "End Date is Invalid";
        }

        // domain images validation
        if (!domainDetails.images || domainDetails.images.length < 2) {
          error.domainIDImages = "Front and Back side images are required";
        }
      }
    }

    try {
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
}

export default RegisterController;