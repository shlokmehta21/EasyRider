import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

class Mail {
  private from?: string;
  private transporter;
  constructor(from?: string) {
    this.from = from;

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    body: string,
    htmlText?: string
  ): Promise<string> {
    const mail = {
      from:
        this.from ?? process.env.PASSWORD_RESET_EMAIL_SENDER_RECIPIENT_ADDRESS,
      to: to,
      subject: subject,
      text: body,
    };

    const message = await this.transporter.sendMail(mail);
    return message.messageId;
  }
}

export default Mail;
