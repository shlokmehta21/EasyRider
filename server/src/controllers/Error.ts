import { Request, Response, NextFunction } from "express";
import CustomError from "../models/CustomError";

class ErrorController {
  handleError(
    error: CustomError,
    req: Request,
    res: Response,
    next?: NextFunction
  ) {
    const statusCode = error.code || 500;
    const errorMessage = error.customMessage || error.message;

    res.status(statusCode).json({ error: errorMessage });
  }

  handleInvalidRequest(res: Response) {
    res.status(400).json({ error: "Invalid Request" });
  }

  handleNotFoundError(res: Response, error: string) {
    res.status(400).json({ error });
  }

  handleInternalServer(res: Response) {
    res.status(500).json({ error: "Internal Server Occurred" });
  }

  handleUnAuthorizedRequest(res: Response) {
    res.status(401).json({ error: "UnAuthorized Request" });
  }
}

export default ErrorController;
