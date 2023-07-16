import { Request, Response, NextFunction } from "express";
import ErrorController from "../controllers/Error";
import UserSession from "../utils/session";

function CheckUserAuthentication(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  const sessionid = req.headers.sessionid as string;
  const session = new UserSession();
  if (!sessionid) {
    new ErrorController().handleError(
      { code: 401, message: "Invalid Session" },
      req,
      resp,
      next
    );
  } else {
    try {
      const sessionId: string = session.validateSessionAndUpdate(sessionid);
      resp.setHeader("sessionid", sessionId);
      next();
    } catch (err: any) {
      resp.setHeader("sessionid", "");
      new ErrorController().handleError(
        { code: 401, message: err.message },
        req,
        resp,
        next
      );
    }
  }
}

export default CheckUserAuthentication;
