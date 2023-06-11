import express, { NextFunction, Request, Response } from "express";
import sanitize from "sanitize-html";

export default function SanitizeInput(
  req: Request,
  _: Response,
  next: NextFunction
): void {
  const _options: sanitize.IOptions = {
    allowedTags: [],
    allowedAttributes: {},
  };
  if (req.body) {
    req.body = sanitize(req.body, _options);
  }
  if (req.query) {
    Object.keys(req.query).forEach((param: string) => {
      if (req.query[param] && typeof req.query[param] === "string") {
        req.query[param] = sanitize(req.query[param] as string, _options);
      }
    });
  }
  next();
}
