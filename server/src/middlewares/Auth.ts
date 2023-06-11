import { Request, Response, NextFunction } from "express";
import ErrorController from "../controllers/error";
import UserSession from "../utils/session";

function CheckUserAuthentication(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  const userId = req.headers.sessionId as string;
  if (!userId) {
    new ErrorController().handleError(
      { code: 401, message: "Invalid Session" },
      req,
      resp,
      next
    );
  } else {
    const isValid: boolean = new UserSession().validateSession(userId);
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
