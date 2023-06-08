import { Request, Response, Router } from "express";
import IController from "../models/interfaces/IController";
import User from "../models/User";
import UserDbModel from "../schemas/User";
import crypto from "crypto";
import { regex } from "../utils/regex";
import routes from "../utils/routesConfig";
import ErrorController from "./error";
import ResetDBModel from "../schemas/Reset";
import { passwordResetLabels } from "../utils/label";
import Mail from "../utils/mail";
import bcrypt from "bcrypt";

class PasswordController implements IController {
  router: Router = Router();
  path: string = routes.PASSWORD as string;

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes = (): void => {
    this.router.get("/ping", (req, res) => res.status(200).json("pong"));
    this.router.post("/forgot-password", this.forgotPassword);
    this.router.post("/reset-password/:token", this.resetPassword);
  };

  async resetPassword(req: Request, resp: Response): Promise<Boolean> {
    const { token } = req.params;
    let { password } = req.body;
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
      // password validation
      const error: { [key: string]: string } = {};
      if (!password) {
        error.password = "Password is required";
      } else {
        if (password.length < 6) {
          error.password = "Password must be at least 6 characters long";
        } else if (!/[a-z]/.test(password)) {
          error.password =
            "Password must contain at least one lowercase letter";
        } else if (!/[A-Z]/.test(password)) {
          error.password =
            "Password must contain at least one uppercase letter";
        } else if (!/\d/.test(password)) {
          error.password = "Password must contain at least one number";
        } else if (!/[@$!%*?&]/.test(password)) {
          error.password =
            "Password must contain at least one special character (@, $, !, %, *, ?, &)";
        } else if (!regex.PASSWORD.test(password)) {
          error.password = "Password must meet all the requirements";
        } else {
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);
          // Update the user object with the hashed password
          password = hashedPassword;
        }
      }
      if (Object.keys(error).length > 0) {
        new ErrorController().handleError(
          { code: 400, message: "Validation error", customMessage: error },
          req,
          resp
        );
      } else {
        db = new UserDbModel();
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
          resp.status(200).json("Password changed successfully");
        }
      }
    }

    return true;
  }

  forgotPassword = async (req: Request, resp: Response): Promise<void> => {
    const { email } = req.body;
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

      try {
        const resetDb = new ResetDBModel();
        const result = await resetDb.getModel().create({
          userId: user.id,
          token,
          expiry,
        });

        const userDb = new UserDbModel();
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
        } else {
          // Compose the reset password email
          const { subject, text } = {
            subject: passwordResetLabels.subject,
            text: passwordResetLabels.getbody(req, resp, token),
          };

          // Send the reset password email
          const mail = new Mail();
          const messageID = mail.sendEmail(user.email, subject, text);
          if (messageID === null) {
            new ErrorController().handleError(
              { code: 500, message: "Internal Server Error Occurred" },
              req,
              resp
            );
          }
          resp.status(200).json({ message: "Password reset token generated" });
        }
      } catch (error) {
        new ErrorController().handleError(
          { code: 500, message: "Internal Server Error" },
          req,
          resp
        );
      }
    }
  };
}

export default PasswordController;
