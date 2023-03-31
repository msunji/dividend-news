const {initializeApp, applicationDefault, cert} = require("firebase-admin/app");
const {getFirestore, Timestamp, FieldValue} = require("firebase-admin/firestore");
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
        sendMail(data);
      } catch (err) {
        console.error(err);
      }
      return null;
    });

exports.helloWorld = functions.https.onRequest(async (request, response) => {
  response.send("Hello from Firebase!");
  const snapshot = await db.collection("cash-dividends").get();
  snapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
  });
  console.log("testing");
  console.log(snapshot);
});
