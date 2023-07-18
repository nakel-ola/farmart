import nodemailer from "nodemailer";
import config from "../config";

export let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // true for 465, false for other ports
  secure: true,
  auth: {
    user: config.stmp_email,
    pass: config.stmp_password,
  },
});

type EmailerType = {
  to: string;
  subject: string;
  text?: string;
  html: string;
};
let emailer = async (args: EmailerType) => {
  await transporter.sendMail({
    ...args,
    from: `Farmart <noreply@gmail.com>`,
  });
};

export default emailer;
