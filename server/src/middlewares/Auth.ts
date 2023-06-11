import { Request, Response, NextFunction } from "express";
import ErrorController from "../controllers/error";
import UserSession from "../utils/session";

function CheckUserAuthentication(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  const sessionId = req.headers.sessionid as string;
  if (!sessionId) {
    new ErrorController().handleError(
      { code: 401, message: "Invalid Session" },
      req,
      resp,
      next
    );
  } else {
    const isValid: boolean = new UserSession().validateSession(sessionId);
    if (!isValid) {
      new ErrorController().handleError(
        { code: 401, message: "Invalid Session" },
        req,
        resp,
        next
      );
    } else next();
  }
}
