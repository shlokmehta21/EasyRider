import { NextFunction, Request, Response } from "express";
import sanitize from "sanitize-html";

export default function sanitizeInput(
  req: Request,
  _: Response,
  next: NextFunction
): void {
  const _options: sanitize.IOptions = {
    allowedTags: [],
    allowedAttributes: {},
  };

  if (req.body) {
    req.body = sanitizeInputs(req.body, _options);
  }

  if (req.query) {
    req.query = sanitizeInputs(req.query, _options);
  }

  next();
}

function sanitizeInputs(data: any, options: sanitize.IOptions): any {
  if (typeof data === "string") {
    return sanitize(data, options).trim();
  } else if (Array.isArray(data)) {
    return data.map((item) =>
      typeof item === "string" ? sanitize(item, options).trim() : item
    );
  } else if (typeof data === "object") {
    for (const key in data) {
      data[key] = sanitizeInputs(data[key], options);
    }
  }

  return data;
}
