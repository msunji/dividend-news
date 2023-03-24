const functions = require("firebase-functions");
const scrape = require("./scraping/scrape");
const sendMail = require("./sendMail/sendMail");
const {defineSecret} = require("firebase-functions/params");

// Define secrets
const sendgridKey = defineSecret("SENDGRID_API");
const recipientList = defineSecret("RECIPIENT_EMAILS");

// // Define params
// const

// eslint-disable-next-line max-len
exports.scheduledDivScraper = functions.runWith({secrets: [sendgridKey, recipientList]}).pubsub
    .schedule("08 16 * * 1-5").timeZone("Asia/Taipei").onRun(async () => {
      try {
        const data = await scrape();
        sendMail(data);
      } catch (err) {
        console.error(err);
      }
      return null;
    });
