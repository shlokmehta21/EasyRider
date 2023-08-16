import { Request, Response, Router } from "express";
import RouteConfig from "../models/interfaces/IRoute";
import routes from "../utils/routesConfig";
import IController from "../models/interfaces/IController";
import User from "../models/User";
import UserDbModel from "../schemas/User";
import crypto from "crypto";
import { regex } from "../utils/regex";
import ErrorController from "./Error";
import ResetDBModel from "../schemas/Reset";
import { passwordResetLabels, registerErrorLabels } from "../utils/label";
import Mail from "../utils/mail";
import bcrypt from "bcrypt";
import CheckUserAuthentication from "../middlewares/Auth";
import path from "path";
import { validDateChecker } from "../utils/date";
import SessionData from "../models/SessionData";
import UserSession from "../utils/session";
import { readFile } from "fs/promises";

class UserProfile implements IController {
  router: Router;
  path: RouteConfig = routes.USER_PROFILE as RouteConfig;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get("/ping", (req, res) => {
      res.json("pong");
    });
    this.router.post(this.path.forgotPassword as string, this.forgotPassword);
    this.router.post(this.path.resetPassword as string, this.resetPassword);
    this.router.use(this.path.default as string, CheckUserAuthentication);
    this.router.post(this.path.default as string, this.getUserProfile);
    this.router.put(this.path.update as string, this.updateProfile);
    this.router.post(
      this.path.profilePicture as string,
      this.updateProfilePicture
    );
    this.router.get(this.path.profilePicture as string, this.getProfilePicture);
    this.router.post(this.path.domainImages as string, this.getDomainImages);
    this.router.put(this.path.updateLocale as string, this.updateLocale);
  }
  updateLocale = async (req: Request, resp: Response): Promise<void> => {
    const { locale }: { locale: string } = req.body;
  };
  updateProfilePicture = async (
    req: Request,
    resp: Response
  ): Promise<void> => {
    const user: User = req.body;
    const error: { [key: string]: string } = {};

    const sessionid: string = req.cookies.sessionid as string;
    const { id, email }: SessionData = new UserSession().getSessionData(
      sessionid
    );

    if (user.profilePicture && !Buffer.isBuffer(user.profilePicture)) {
      error.profilePicture = "Invalid profile picture format";
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
        id,
        email: email,
      });
      if (!isUserExists) {
        new ErrorController().handleError(
          {
            code: 400,
            message: "User doesn't exist",
          },
          req,
          resp
        );
        return;
      }

      // Create the user in the database
      const result = await db
        .getModel()
        .findOneAndUpdate({ id }, { profilePicture: user.profilePicture });

      if (result instanceof Error) {
        new ErrorController().handleError(
          {
            code: 500,
            message: "Error Occurred while updating user's picture",
          },
          req,
          resp
        );
        return;
      }

      resp.status(200).json(true);
    } catch (err) {
      console.error(
        "An error occurred while updating the user's picture:",
        err
      );
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
  updateProfile = async (req: Request, resp: Response): Promise<void> => {
    const user: User = req.body;
    const error: { [key: string]: string } = {};

    const sessionid: string = req.cookies.sessionid as string;
    const session = new UserSession();
    const { id, email }: SessionData = session.getSessionData(sessionid);

    const updateData: any = {
      license: {},
    };
    // firstName validation
    const { firstName } = user;
    if (firstName) {
      if (
        firstName.length <= 2 ||
        !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(firstName)
      ) {
        error.firstName = "Invalid First Name";
      } else {
        updateData.firstName = firstName;
      }
    }

    // lastName validation
    const { lastName } = user;
    if (lastName) {
      if (
        lastName.length <= 2 ||
        !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(lastName)
      ) {
        error.lastName = "Invalid Last Name";
      } else {
        updateData.lastName = lastName;
      }
    }

    // Email validation
    if (user.email) {
      if (!regex.EMAIL.test(user.email)) {
        error.email = "Invalid Email ID";
      } else {
        updateData.email = user.email;
      }
    }

    // dob validation
    const { dob } = user;
    if (dob) {
      if (!validDateChecker(dob)) {
        error.dob = "Invalid Date of Birth";
      } else {
        updateData.dob = dob;
      }
    }

    const { profilePicture } = user;
    if (profilePicture) {
      if (!Buffer.isBuffer(profilePicture)) {
        error.profilePicture = "Invalid profile picture format";
      } else {
        updateData.profilePicture = profilePicture;
      }
    }

    // license validation
    const { license } = user;
    if (license && Object.keys(license).length > 0) {
      if (!license.number) {
        error.licenseNo = "License is required";
      } else {
        updateData.license.number = license.number;
      }
      if (!license.images || license.images.length < 1) {
        error.licenseImage = "License Image is required";
      } else {
        updateData.license.images = license.images;
      }
    }

    // domain validation
    const { domain } = user;
    if (domain && domain.length === 1) {
      const domainDetails = domain[0];
      updateData.domain = [{}];
      if (domainDetails.name) {
        if (
          domainDetails.name.length <= 2 ||
          !regex.ALPHANUMERIC_WITH_STARTING_WITH_LETTER.test(domainDetails.name)
        ) {
          error.domainName = "Invalid Domain Name";
        } else {
          updateData.domain[0].name = domainDetails.name;
        }
      }

      if (domainDetails.domainID) {
        updateData.domain[0].domainID = domainDetails.domainID;
      }

      if (domainDetails.startDate) {
        if (!validDateChecker(domainDetails.startDate)) {
          error.domainStartDate = "Invalid End Date";
        } else {
          updateData.domain[0].startDate = domainDetails.startDate;
        }
      }

      if (domainDetails.endDate) {
        if (!validDateChecker(domainDetails.endDate)) {
          error.domainEndDate = "Invalid End Date";
        } else updateData.domain[0].endDate = domainDetails.endDate;
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
        id,
        email: email,
      });
      if (!isUserExists) {
        new ErrorController().handleError(
          {
            code: 400,
            message: "User doesn't exist",
          },
          req,
          resp
        );
        return;
      }

      // Create the user in the database
      const result = await db.getModel().findOneAndUpdate({ id }, updateData);

      if (result instanceof Error) {
        new ErrorController().handleError(
          {
            code: 500,
            message: "Error Occurred while updating user",
          },
          req,
          resp
        );
        return;
      }

      // Set the session ID as a cookie in the response
      if (user.email) {
        resp.cookie(
          "sessionid",
          session.createUniqueSession({
            id,
            email: user.email,
          }),
          {
            httpOnly: true,
            // secure: true,
            sameSite: "strict",
          }
        );
      }

      resp.status(200).json(true);
    } catch (err) {
      console.error("An error occurred while updating the user:", err);
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

  getUserProfile = (req: Request, resp: Response): void => {
    const { id }: { id: string } = req.body as { id: string };
    if (!id) {
      new ErrorController().handleError(
        { code: 400, message: "User ID is required" },
        req,
        resp
      );
      return;
    }

    const db = new UserDbModel().getModel();
    db.findOne(
      { id },
      {
        id: 1,
        _id: 0,
        firstName: 1,
        lastName: 1,
        email: 1,
        dob: 1,
        locale: 1,
        license: 1,
        phoneNumber: 1,
        domain: {
          id: 1,
          name: 1,
          domainID: 1,
          startDate: 1,
          endDate: 1,
        },
      }
    )
      .then((user: User | null) => {
        if (user) {
          if (
            user.license &&
            user.license.number &&
            user.license.number === "XXX"
          ) {
            user.set("license", undefined, { strict: false });
          }
          resp.status(200).json(user);
        } else {
          new ErrorController().handleError(
            { code: 400, message: "User Not Found" },
            req,
            resp
          );
        }
      })
      .catch((err: Error) => {
        console.log(err);
        new ErrorController().handleError(
          { code: 500, message: "Internal Server Error Occurred" },
          req,
          resp
        );
      });
  };

  getProfilePicture = (req: Request, resp: Response): void => {
    const { id }: { id: string } = req.params as { id: string };
    if (!id) {
      new ErrorController().handleError(
        { code: 400, message: "User ID is required" },
        req,
        resp
      );
      return;
    }

    const db = new UserDbModel().getModel();
    db.findOne(
      { id },
      {
        id: 1,
        _id: 0,
        profilePicture: 1,
      }
    )
      .then((user: User | null) => {
        if (user) {
          resp.status(200).json(user);
        } else {
          new ErrorController().handleError(
            { code: 400, message: "User Not Found" },
            req,
            resp
          );
        }
      })
      .catch((err: Error) => {
        new ErrorController().handleError(
          { code: 500, message: "Internal Server Error Occurred" },
          req,
          resp
        );
      });
  };

  getDomainImages = (req: Request, resp: Response): void => {
    const { id }: { id: string[] } = req.body || [];
    if (id.length === 0) {
      new ErrorController().handleError(
        { code: 400, message: "Domain ID is required" },
        req,
        resp
      );
      return;
    }

    const db = new UserDbModel().getModel();
    db.find(
      { "domain.id": { $in: id } },
      {
        id: 1,
        _id: 0,
        domain: {
          id: 1,
          domainID: 1,
          images: 1,
        },
      }
    )
      .then((users: User[] | null) => {
        if (users && users.length > 0) {
          resp.status(200).json({ users });
        } else {
          new ErrorController().handleError(
            { code: 400, message: "Domain Not Found" },
            req,
            resp
          );
        }
      })
      .catch((err: Error) => {
        console.log(err);
        new ErrorController().handleError(
          { code: 500, message: "Internal Server Error Occurred" },
          req,
          resp
        );
      });
  };

  resetPassword = async (req: Request, resp: Response): Promise<void> => {
    const { token }: { token: string } = req.params as { token: string };
    if (!token) {
      new ErrorController().handleError(
        { code: 400, message: "Token is required" },
        req,
        resp
      );
      return;
    }

    let {
      password,
      confirmPassword,
    }: { password: string; confirmPassword: string } = req.body;

    if (!password || !confirmPassword) {
      new ErrorController().handleError(
        { code: 400, message: "Invalid Password" },
        req,
        resp
      );
      return;
    }

    let db: ResetDBModel | UserDbModel = new ResetDBModel();
    const resetData = await db.findOneByParams({
      token,
      expiry: { $gt: Date.now() },
    });
    if (resetData === null) {
      new ErrorController().handleError(
        { code: 400, message: "Invalid Token or Password" },
        req,
        resp
      );
    } else {
      const isValid =
        this.passwordValidation(password) &&
        this.passwordValidation(confirmPassword);
      if (!isValid) {
        new ErrorController().handleError(
          {
            code: 400,
            customMessage: {
              password: "Password didn't meet all requirements",
            },
          },
          req,
          resp
        );
      } else if (password !== confirmPassword) {
        new ErrorController().handleError(
          {
            code: 400,
            customMessage: { confirmPassword: "Passwords didn't match" },
          },
          req,
          resp
        );
      } else {
        db = new UserDbModel();
        password = await bcrypt.hash(password, 10);
        const result = await db.findByParamsAndUpdate(
          { id: resetData.userId },
          { password }
        );
        if (!result) {
          new ErrorController().handleError(
            { code: 500, message: "Internal Server Error Occurred" },
            req,
            resp
          );
        } else {
          resp.status(200).json(true);
        }
      }
    }
  };

  forgotPassword = async (req: Request, resp: Response): Promise<void> => {
    const { email }: { email: string } = req.body;
    const errors: { [key: string]: string } = {};
    if (!email) {
      errors.email = "Email ID is required";
    } else if (!regex.EMAIL.test(email)) {
      errors.email = "Invalid Email ID";
    }

    if (Object.keys(errors).length > 0) {
      new ErrorController().handleError(
        { code: 400, customMessage: errors },
        req,
        resp
      );
      return;
    }

    const userDb = new UserDbModel();
    const user: User | null = await userDb.findOneByParams({ email });
    if (user === null) {
      new ErrorController().handleError(
        { code: 400, customMessage: { email: "User not found" } },
        req,
        resp
      );
    } else {
      const token: string = crypto.randomBytes(20).toString("hex");
      const expiry: number = Date.now() + 3600000;
      // Compose the reset password email
      const { subject, text } = {
        subject: passwordResetLabels.subject,
        text: passwordResetLabels.getbody(req, resp, token),
      };
      try {
        const resetDb = new ResetDBModel();
        const result = await resetDb.getModel().create({
          userId: user.id,
          token,
          expiry,
        });

        const userDb = new UserDbModel();

        // Send the reset password email
        const mail = new Mail();
        const messageID = await mail.sendEmail(user.email, subject, text);
        if (messageID === null) {
          new ErrorController().handleError(
            { code: 500, message: "Internal Server Error Occurred" },
            req,
            resp
          );
        }

        const updateResult = await userDb.findByParamsAndUpdate(
          { id: user.id },
          { updatedOn: Date.now() }
        );
        if (result instanceof Error || !updateResult) {
          new ErrorController().handleError(
            { code: 500, message: "Failed to reset the password" },
            req,
            resp
          );
        }

        resp.status(200).json(true);
      } catch (error) {
        // new ErrorController().handleError(
        //   { code: 500, message: "Internal Server Error " + text },
        //   req,
        //   resp
        // );
        new ErrorController().handleError(
          { code: 500, message: text },
          req,
          resp
        );
      }
    }
  };

  passwordValidation(password: string): boolean {
    // password validation
    const error: { [key: string]: string } = {};
    if (!password) {
      error.password = "Password is required";
    } else {
      if (password.length < 6) {
        error.password = "Password must be at least 6 characters long";
      } else if (!/[a-z]/.test(password)) {
        error.password = "Password must contain at least one lowercase letter";
      } else if (!/[A-Z]/.test(password)) {
        error.password = "Password must contain at least one uppercase letter";
      } else if (!/\d/.test(password)) {
        error.password = "Password must contain at least one number";
      } else if (!/[@$!%*?&]/.test(password)) {
        error.password =
          "Password must contain at least one special character (@, $, !, %, *, ?, &)";
      } else if (!regex.PASSWORD.test(password)) {
        error.password = "Password must meet all the requirements";
      }
    }
    if (Object.keys(error).length > 0) return false;
    return true;
  }
}

export default UserProfile;
