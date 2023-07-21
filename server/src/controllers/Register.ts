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
import { readFile } from "fs/promises";
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

    // Read image files asynchronously
    const imagesBuffer = await Promise.all([
      readFile(path.join(__dirname, "../asset/img/bottle.png")),
      readFile(path.join(__dirname, "../asset/img/bottle.png")),
    ]);

    // Assign image buffers to user domain
    user.domain[0].images = imagesBuffer;

    // firstName validation
    const { firstName } = user;
    if (!firstName || !firstName.trim()) {
      error.firstName = "First Name is required";
    } else if (
      firstName.length <= 2 ||
      !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(firstName)
    ) {
      error.firstName = "Invalid First Name";
    } else {
      user.firstName = firstName.trim();
    }

    // lastName validation
    const { lastName } = user;
    if (!lastName || !lastName.trim()) {
      error.lastName = "Last Name is required";
    } else if (
      lastName.length <= 2 ||
      !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(lastName)
    ) {
      error.lastName = "Invalid Last Name";
    } else {
      user.lastName = lastName.trim();
    }

    // Email validation
    const { email } = user;
    if (!email || !email.trim()) {
      error.email = "Email ID is required";
    } else if (!regex.EMAIL.test(email)) {
      error.email = "Invalid Email ID";
    } else {
      user.email = email.trim();
    }

    // dob validation
    if (!user.dob || !validDateChecker(user.dob)) {
      error.dob = "Invalid Date of Birth";
    }

    // password validation
    const { password, confirmPassword } = user;
    if (!password || !password.trim()) {
      error.password = "Password is required";
    } else if (password.length < 6 || !regex.PASSWORD.test(password)) {
      error.password = "Invalid Password";
    } else if (password !== confirmPassword) {
      error.confirmPassword = "Password must match";
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // license validation
    const { license } = user;
    if (license && Object.keys(license).length > 0) {
      if (!license.number) {
        error.licenseNo = "License is required";
      }
      if (!license.images || license.images.length < 1) {
        error.licenseImage = "License Image is required";
      }
    }

    // domain validation
    const { domain } = user;
    if (!domain || domain.length < 1) {
      error.domain = "Organisation/Institution name is required";
    } else {
      const domainDetails = domain[0];
      if (!domainDetails || !domainDetails.name || !domainDetails.name.trim()) {
        error.domainName = "Name is required";
      } else if (
        domainDetails.name.length <= 2 ||
        !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(domainDetails.name)
      ) {
        error.domainName = "Invalid Domain Name";
      } else {
        domainDetails.name = domainDetails.name.trim();
      }

      if (!domainDetails.domainID) {
        error.domainID = "Organisation/Institution ID is required";
      }

      if (
        !domainDetails.startDate ||
        !validDateChecker(domainDetails.startDate)
      ) {
        error.domainStartDate = "Invalid Start Date";
      }

      if (domainDetails.endDate && !validDateChecker(domainDetails.endDate)) {
        error.domainEndDate = "Invalid End Date";
      }

      if (!domainDetails.images || domainDetails.images.length < 2) {
        error.domainIDImages = "Front and Back side images are required";
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

    try {
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

      // Create the user in the database
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
      console.error("An error occurred while registering the user:", err);
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
