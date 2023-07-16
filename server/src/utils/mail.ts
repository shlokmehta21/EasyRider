import nodemailer from "nodemailer";

class Mail {
  private from?: string;
  private transporter;
  constructor(from?: string) {
    this.from = from || process.env.USER_EMAIL;

    this.transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
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
      from: this.from,
      to: to,
      subject: subject,
      text: body,
    };

    const message = await this.transporter.sendMail(mail);
    return message.messageId;
  }
}

export default Mail;
