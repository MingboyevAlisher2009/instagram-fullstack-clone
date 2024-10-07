import nodemailer from "nodemailer";
import { VERIFICATION_EMAIL_TEMPLATE } from "./email-tempates.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "mingboyevalisher171@gmail.com",
    pass: "hrky sfwo hfwt dait",
  },
});
 
export const sendEmail = async (email, code) => {
  try {
    const mailOptions = {
      from: "instagram@gmail.com",
      to: email,
      subject: "Your Verification Code",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", code),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(error);
  }
};
