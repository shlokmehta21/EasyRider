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
}

export default ErrorController;
