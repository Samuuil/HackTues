import nodemailer from "nodemailer";


import dotenv from "dotenv";
dotenv.config();



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",   // SMTP server
    port: 456,                // TLS port (587)
    secure: true, 
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL, 
      to, 
      subject, 
      text, 
    });

    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}
  