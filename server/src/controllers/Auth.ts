import { Request, Response, Router } from "express";
import routes from "../utils/routesConfig";
import UserDbModel from "../schemas/User";
import User from "../models/User";
import ErrorController from "./Error";
import UserSession from "../utils/session";
import { regex } from "../utils/regex";
import bcrypt from "bcrypt";
import IController from "../models/interfaces/IController";

class AuthController implements IController {
  router: Router;
  path: string = routes.LOGIN as string;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes = (): void => {
    this.router.post(this.path, this.login);
    this.router.get(routes.LOGOUT as string, this.logout);
  };

  logout(req: Request, resp: Response): void {
    try {
      const sessionid: string = req.cookies.sessionid as string;
      if (sessionid) {
        if (!new UserSession().validateSession(sessionid)) {
          new ErrorController().handleError(
            { code: 400, message: "Invalid session" },
            req,
            resp
          );
          return;
        }
        resp.cookie("sessionid", "", {
          httpOnly: true,
          // secure: true,
          maxAge: 0,
          sameSite: "strict",
        });
        resp.status(200).json(true);
      } else {
        new ErrorController().handleError(
          { code: 400, message: "User not logged In" },
          req,
          resp
        );
      }
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
    const sessionid = req.cookies.sessionid as string;
    if (sessionid) {
      // Set the session ID as a cookie in the response
      const updateSeesionId = new UserSession().validateSessionAndUpdate(
        sessionid
      );
      resp.cookie("sessionid", updateSeesionId, {
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
      });
      resp.status(202).json(true);
      return;
    }

    const { email, password }: { email: string; password: string } = req.body;
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
          id: user.id,
          email: user.email,
        });
        // remove password from user object
        const userObj = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        };
        // Set the session ID as a cookie in the response
        resp.cookie("sessionid", sessionId, {
          httpOnly: true,
          // secure: true,
          sameSite: "strict",
        });

        resp.status(200).json(userObj);
      }
    } catch (err) {
      console.error(err);
      resp.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default AuthController;
