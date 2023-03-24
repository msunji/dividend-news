// Import dependencies
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * @return {arr} Array of viewer popup urls
 */
async function getViewerLinks() {
  const dateTodayArr = new Date().toISOString().slice(0, 10).split("-");
  const parsedDateToday = [...dateTodayArr.slice(1), dateTodayArr[0]].join("-");

  try {
    const res = await axios.get(
        // eslint-disable-next-line max-len
        `${process.env.PSE_NEWS}&fromDate=${parsedDateToday}&toDate=${parsedDateToday}`,
    );
    const document = res.data;

    // Load the document
    const $ = cheerio.load(document);

    const newsLinks = [];

    // Select announcement table
    const $divRows = $("tbody tr");
    const $divCells = $("tbody tr td");

    /*
      Check if the number of cells is > 1
      On days with no news, the number of table cells === 1
    */
    if ($divCells.length === 1) {
      return newsLinks;
    }
    $divRows.each((index, row) => {
      newsLinks.push(
          `${process.env.PSE_DOMAIN}/openDiscViewer.do?edge_no=${
            $(row).find("a").eq(1).attr("onclick").split("'")[1]
          }`,
      );
    });
    return newsLinks;
  } catch (err) {
    console.error(err);
  }
}

module.exports = getViewerLinks;
