require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const getViewerLinks = require("./getViewerLinks");

async function scrape() {
  const linksToScrape = await getViewerLinks();
  const promises = linksToScrape.map(async (link) => {
    const res = await axios.get(link);
    const document = res.data;
    const $ = cheerio.load(document);

    // Get details from news viewer popup
    const company = $("#viewHeader h2").text();
    const announcementDate = $("#viewHeader p").text().split(": ")[1];

    // Get iframe content
    // Select iframe element and get src
    const iframeSrc = $("#viewContents").attr("src");
    const iframeContent = await axios.get(
      `${process.env.PSE_DOMAIN}/${iframeSrc}`
    );
    const iframeDoc = iframeContent.data;

    // Load iframe content
    const $iframe = cheerio.load(iframeDoc);

    // Helper function for dealing with iframe data
    function getIframeValue(cellValue) {
      return $iframe(`th:contains('${cellValue}')`).next().text();
    }

    // Get data from iframe
    // Ex-Date
    const exDate = $iframe("#remarkContents span").text().split(": ")[1];

    // Dividend Type
    const divType = getIframeValue("Type (Regular or Special)");
    // Amount of Cash div/share
    const cashDivAmount = getIframeValue("Amount of Cash Dividend Per Share");
    // Record Date
    const recordDate = getIframeValue("Record Date");
    // Payment Date
    const paymentDate = getIframeValue("Payment Date");

    const announcement = {
      company,
      announcementDate,
      exDate,
      divType,
      cashDivAmount,
      recordDate,
      paymentDate
    };
    return announcement;
  });
  const announcements = await Promise.all(promises);
  console.log(announcements);
  return announcements;
}

scrape();
