import { AxiosResponse } from "axios";

export function getSessionId(headers: AxiosResponse["headers"]): string {
  try {
    const cookies = headers["set-cookie"];
    if (cookies) {
      const sessionIdCookie = cookies.find((cookie: string) =>
        cookie.includes("sessionid=")
      );
      if (sessionIdCookie) {
        const sessionId = sessionIdCookie.split("sessionid=")[1].split(";")[0];
        return sessionId;
      }
    }
    return "";
  } catch {
    return "";
  }
}
