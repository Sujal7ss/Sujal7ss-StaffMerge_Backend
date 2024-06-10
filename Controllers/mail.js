import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
});

const sendWelcomeEmail = async (email) => {
  const mailOptions = {
    to: email,
    from: process.env.MAIL,
    subject: "Welcome to StackMerge",
    text:
      `Welcome to StackMerge!\n\n` +
      `Thank you for joining our community. We're excited to help you connect with top job opportunities and take the next step in your career.\n\n` +
      `If you have any questions or need assistance, feel free to reach out to our support team. Happy job hunting!\n\n` +
      `Best regards,\n` +
      `The StaffMerge Team\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error("Error sending email:", err);
    }
  });
};

const sendAppliedMail = async (email, title, companyName) => {
  const emailContent = `
    <p>Dear Applicant,</p>
    <p>Thank you for applying for the ${title} role at ${companyName}. We have received your application and will review it shortly.</p>
    <p>Best regards,</p>
    <p>The ${companyName} Team</p>
  `;

  const mailOptions = {
    to: email,
    from: process.env.MAIL,
    subject: "Application Confirmation",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error("Error sending email:", err);
    }
  });
};

const sendSelectedMail = async (title, companyName, email) => {
  const emailContent = `
    <p>Dear Applicant,</p>
    <p>Congratulations! We are pleased to inform you that you have been selected for the ${title} role at ${companyName}. Welcome to the team!</p>
    <p>Your application has been successful, and we look forward to having you on board.</p>
    <p>Best regards,</p>
    <p>The ${companyName} Team</p>
  `;
  const mailOptions = {
    to: email,
    from: process.env.MAIL,
    subject: "Application Confirmation",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error("Error sending email:", err);
    }
  });
};

export { sendWelcomeEmail, sendAppliedMail , sendSelectedMail};
