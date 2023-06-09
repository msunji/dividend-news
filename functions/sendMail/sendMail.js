require("dotenv").config();
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

// Get email template from templates directory
const emailTemplate = fs.readFileSync(
    path.join(__dirname, "./templates/email.handlebars"),
    "utf-8");

/**
 * Sends email with collated announcements
 * @param {obj} announcementData The announcement obj
 */
function sendEmail(announcementData) {
  console.log(announcementData);
  // Set up transporter object
  // Using Sendgrid for this one
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API,
    },
  });

  // Only send email if announcementArr isn't empty
  // ie. there IS something to report
  if (announcementData.announcements.length) {
    // Use the Handlebars template we made earlier
    const template = handlebars.compile(emailTemplate);
    // Pass the data to the handlebars template
    const msgBody = template(announcementData);

    // Get list of recipients
    const recipientList = process.env.RECIPIENT_EMAILS.split(",");

    // Send mail!
    transporter.sendMail(
        {
          from: `Marge Consunji <${process.env.SENDER_EMAIL}>`,
          to: recipientList,
          // to: "mae.sunji@gmail.com",
          subject: "PSE Dividend Updates",
          text: "Good afternoon. Here are today's PSE Dividend Announcements.",
          html: msgBody,
        },
        (err, info) => {
          if (err) {
            return console.error(err);
          }
          return console.log("Email sent: " + info.messageId);
        },
    );
  }
}

module.exports = sendEmail;
