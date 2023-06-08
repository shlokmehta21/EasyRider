import express, { Request, Response, Router } from "express";
import IController from "../models/interfaces/IController";
import { regex } from "../utils/regex";
import routes from "../utils/routesConfig";
import bcrypt from "bcrypt";
import UserDbModel from "../schemas/User";
import User from "../models/User";
import ErrorController from "./error";

class LoginController implements IController {
  router: Router = express.Router();
  path: string = routes.LOGIN as string;

  initializeRoutes = (): void => {
    this.router.post(this.path, this.login);
  };

  async login(req: Request, resp: Response): Promise<void> {
    const { email, password } = req.body;
    const error: { [key: string]: string } = {};

    // email validation
    if (!email) {
      error.email = "Email ID is required";
    } else if (!regex.EMAIL.test(email)) {
      error.email = "Invalid Email ID";
    }

    // password validation
    if (!password) {
      error.password = "Password is required";
    }

    if (Object.keys(error).length > 0) {
      new ErrorController().handleError(
        { code: 400, message: "Validation error", customMessage: error },
        req,
        resp
      );
      return;
    }
    try {
      const db = new UserDbModel();
      const user: User | null = await db.findOneByParams({ email });
      if (!user) {
        new ErrorController().handleError(
          { code: 400, message: "Email ID not registered" },
          req,
          resp
        );
      } else if (!(await bcrypt.compare(password, user.password))) {
        new ErrorController().handleError(
          { code: 400, message: "Email ID and Password didn't match" },
          req,
          resp
        );
      } else {
        req.session.userId = user.id;
        resp.sendStatus(200).json(true);
      }
    } catch {}
  }
}

declare module "express-session" {
  export interface SessionData {
    userId: string;
  }
}

export default LoginController;
