// Import dependencies
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");

// Start scraping
async function scrape() {
  try {
    const res = await axios.get(process.env.TEST_NEWS);
    const document = res.data;

    // Load the document
    const $ = cheerio.load(document);

    let newsLinks = [];

    // Select announcement table
    const $divRows = $("tbody tr");
    const $divCells = $("tbody tr td");

    /*
      Check if the number of cells is > 1
      On days with no news, the number of table cells === 1
    */
    if ($divCells.length === 1) {
      return;
    }
    $divRows.each((index, row) => {
      newsLinks.push(
        `https://edge.pse.com.ph/openDiscViewer.do?edge_no=${
          $(row).find("a").eq(1).attr("onclick").split("'")[1]
        }`
      );
    });
  } catch (err) {
    console.error(err);
  }
}

scrape();
