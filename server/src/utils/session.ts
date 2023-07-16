import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import SessionData from "../models/SessionData";

export default class UserSession {
  #sessionId?: string;
  #signOptions: jwt.SignOptions;
  #SECRET_KEY: string = (process.env.SECRET_KEY ||
    "group4Capston@easyrider.com") as string;
  constructor() {
    this.#signOptions = {
      expiresIn: "8760h",
      algorithm: "HS512",
      subject: "user",
      issuer: "easy rider",
      jwtid: uuidv4(),
    };
  }

  createUniqueSession(payload: { [key: string]: string }): string {
    this.#sessionId = jwt.sign(payload, this.#SECRET_KEY, this.#signOptions);
    return this.#sessionId;
  }

  updateSession(payload: { [key: string]: string }): string {
    this.#sessionId = jwt.sign(payload, this.#SECRET_KEY, {
      ...this.#signOptions,
      expiresIn: "8760h",
    });
    return this.#sessionId;
  }

  getSessionData(token: string): SessionData {
    try {
      const obj: Object = jwt.verify(token, this.#SECRET_KEY);
      return obj as SessionData;
    } catch (error) {
      // Handle error, such as invalid session ID or expired token
      console.error(error);
      throw new Error("Invalid Session");
    }
  }

  validateSessionAndUpdate(token: string): string {
    const resp: jwt.JwtPayload = jwt.verify(
      token,
      this.#SECRET_KEY
    ) as jwt.JwtPayload;
    if (resp instanceof Error) {
      throw new Error("Session Expired");
    }

    const newExp = Math.floor(Date.now() / 1000) + 8760 * 3600;
    resp.exp = newExp;
    const updatedToken = jwt.sign(resp, this.#SECRET_KEY);
    return updatedToken;
  }

  validateSession(token: string): boolean {
    const resp: jwt.JwtPayload = jwt.verify(
      token,
      this.#SECRET_KEY
    ) as jwt.JwtPayload;
    if (resp instanceof Error) {
      return false;
    }
    return true;
  }
}
