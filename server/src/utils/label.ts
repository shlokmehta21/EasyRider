import { Request, Response } from "express";

export const registerErrorLabels = {
  USER_ALREADY_EXISTS: "User already exists",
};

export const passwordResetLabels = {
  subject: "Password Reset",
  getbody(req: Request, resp: Response, resetToken: string): string {
    return `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n
    Please click on the following link to reset your password:
    ${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken} If you did not request this, please ignore this email and your password will remain unchanged.`;
  },
};
