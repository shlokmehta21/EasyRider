import express, { Request, Response, Router } from "express";
import IController from "../models/interfaces/IController";
import { regex } from "../utils/regex";
import routes from "../utils/routesConfig";
import bcrypt from "bcrypt";
import UserDbModel from "../schemas/User";
import User from "../models/User";
import ErrorController from "./error";
import UserSession from "../utils/session";

class AuthController implements IController {
  router: Router = express.Router();
  path: string = routes.LOGIN as string;

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes = (): void => {
    this.router.post(this.path, this.login);
    this.router.get(routes.LOGOUT as string, this.logout);
  };

  logout(req: Request, resp: Response): void {
    try {
      if (req.headers.sessionid) {
        delete req.headers.sessionid;
        resp.status(200).json(true);
      } else {
        new ErrorController().handleError(
          { code: 400, message: "User not logged In" },
          req,
          resp
        );
      }
      return;
    } catch (err) {
      console.log(err);
      new ErrorController().handleError(
        { code: 500, message: "Internal server error" },
        req,
        resp
      );
    }
  }

  async login(req: Request, resp: Response): Promise<void> {
    const sessionId = req.headers.sessionid as string;
    if (sessionId) {
      resp.status(202).json(true);
      return;
    }

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
      if (!user || !user.id) {
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
        const sessionId = new UserSession().createUniqueSession({
          userId: user.id,
          email: user.email,
        });
        // remove password from user object
        const userObj = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          license: user.license,
          phoneNumber: user.phoneNumber,
          sessionId: sessionId,
        };
        resp.status(200).setHeader("sessionId", sessionId).json(userObj);
      }
    } catch (err) {
      console.error(err);
      resp.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default AuthController;
