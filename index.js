const scrape = require("./scraping/scrape");
const sendMail = require("./sendMail/sendMail");

(async () => {
  try {
    const data = await scrape();
    sendMail(data);
  } catch (err) {
    console.error(err);
  }
})();
