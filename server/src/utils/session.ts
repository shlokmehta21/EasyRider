import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export default class UserSession {
  #sessionId?: string;
  #signOptions: jwt.SignOptions;
  constructor() {
    this.#signOptions = {
      expiresIn: "never",
      algorithm: "HS512",
      subject: "user",
      issuer: "easy rider",
      jwtid: uuidv4(),
    };
  }

  createUniqueSession(payload: { [key: string]: string }): string {
    this.#sessionId = jwt.sign(
      payload,
      (process.env.SECRET_KEY || "group4Capston@easyrider.com") as string,
      this.#signOptions
    );
    return this.#sessionId;
  }

  validateSession(token: string): boolean {
    const resp = jwt.verify(token, process.env.SECRET_KEY as string);
    if (resp instanceof Error) {
      return false;
    }
    console.log(resp);
    return true;
  }
}
