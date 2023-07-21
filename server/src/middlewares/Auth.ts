import { Request, Response, NextFunction } from "express";
import ErrorController from "../controllers/Error";
import UserSession from "../utils/session";

function CheckUserAuthentication(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  const sessionid = req.cookies.sessionid as string;
  if (!sessionid) {
    new ErrorController().handleError(
      { code: 401, message: "Session ID is missing" },
      req,
      resp,
      next
    );
  } else {
    const session = new UserSession();
    try {
      const updatedSessionId: string =
        session.validateSessionAndUpdate(sessionid);
      resp.cookie("sessionid", updatedSessionId, {
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
      });
      next();
    } catch (err: any) {
      // Handle specific error cases for invalid or expired sessions
      if (err.name === "SessionExpiredError") {
        new ErrorController().handleError(
          { code: 401, message: "Session has expired" },
          req,
          resp,
          next
        );
      } else {
        new ErrorController().handleError(
          { code: 401, message: "Invalid Session ID" },
          req,
          resp,
          next
        );
      }
    }
  }
}

export default CheckUserAuthentication;
