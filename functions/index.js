const functions = require("firebase-functions");
const scrape = require("./scraping/scrape");
const sendMail = require("./sendMail/sendMail");
const {defineSecret} = require("firebase-functions/params");

// Define secrets
const SENDGRID_API = defineSecret("SENDGRID_API");
const RECIPIENT_EMAILS = defineSecret("RECIPIENT_EMAILS");

// eslint-disable-next-line max-len
exports.scheduledDivScraper = functions.runWith({secrets: [SENDGRID_API, RECIPIENT_EMAILS]}).pubsub
    .schedule("30 16 * * 1-5").timeZone("Asia/Taipei").onRun(async () => {
      try {
        const data = await scrape();
        sendMail(data);
      } catch (err) {
        console.error(err);
      }
      return null;
    });
