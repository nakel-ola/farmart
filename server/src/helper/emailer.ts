import nodemailer from "nodemailer";
import config from "../config";

export let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // true for 465, false for other ports
  auth: {
    user: config.stmp_email, // generated ethereal user
    pass: config.stmp_password, // generated ethereal password
  },
});

type EmailerType = {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
};
let emailer = async (args: EmailerType) => {
  await transporter.sendMail({ ...args });
};

export default emailer;
