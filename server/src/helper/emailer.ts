import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "precious.mosciski@ethereal.email", // generated ethereal user
    pass: "cJqhzufgEfXB52rUK8", // generated ethereal password
  },
  
});

type EmailerType = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};
let emailer = async ({ from, to, subject, text, html }: EmailerType) => {
  await transporter.sendMail({
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
};

export default emailer;
