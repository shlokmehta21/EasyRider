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
import { passwordResetLabels } from "../utils/label";
import Mail from "../utils/mail";
import bcrypt from "bcrypt";
import CheckUserAuthentication from "../middlewares/Auth";

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
  }

  resetPassword = async (req: Request, resp: Response): Promise<void> => {
    const { token } = req.params;
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

    console.log(email);

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
