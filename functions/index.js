const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const scrape = require("./scraping/scrape");
const sendMail = require("./sendMail/sendMail");
const {defineSecret} = require("firebase-functions/params");

// Initialise Firestore
initializeApp({
  projectId: "dividend-news",
});
const db = getFirestore();

/**
 * returns snapshot
 */
async function testDb() {
  const snapshot = await db.collection("cash-dividends").get();
  snapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
  });
  console.log(snapshot);
}

testDb();

// Define secrets
const SENDGRID_API = defineSecret("SENDGRID_API");
const RECIPIENT_EMAILS = defineSecret("RECIPIENT_EMAILS");

// eslint-disable-next-line max-len
exports.scheduledDivScraper = functions.runWith({secrets: [SENDGRID_API, RECIPIENT_EMAILS]}).pubsub
    .schedule("30 16 * * 1-5").timeZone("Asia/Taipei").onRun(async () => {
      try {
        const data = await scrape();
        const {date, announcements} = data;
        if (announcements.length) {
          sendMail(data);
          await db.collection("cash-dividends").doc().set({
            date,
            announcements,
          });
        }
      } catch (err) {
        console.error(err);
      }
      return null;
    });

// exports.helloWorld = functions.https.onRequest(async (request, response) => {
//   response.send("Hello from Firebase!");
//   try {
//     const data = await scrape();
//     const {date, announcements} = data;
//   } catch (err) {
//     console.error(err);
//   }
//   return null;
// });
