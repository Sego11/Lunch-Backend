import { createTransport } from "nodemailer";

export default async (option) => {
  //creating a transporter
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  });

  //defining email options
  const emailOptions = {
    from: "nascotech support <support@nascotech.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(emailOptions);
};
