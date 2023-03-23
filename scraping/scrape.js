require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const getViewerLinks = require("./getViewerLinks");

async function resolveValues(promisesToResolve) {
  try {
    const resolved = await Promise.all(promisesToResolve);
    return resolved;
  } catch (err) {
    console.error(err);
  }
}

async function getIframeSrc() {
  const linksToScrape = await getViewerLinks();
  const promises = linksToScrape.map(async (link) => {
    const res = await axios.get(link);
    const $popup = cheerio.load(res.data);

    // Select iframe element and get src
    const src = $popup("#viewContents").attr("src");
    return `${process.env.PSE_DOMAIN}/${src}`;
  });

  return await resolveValues(promises);
}

async function scrape() {
  const iframesToScrape = await getIframeSrc();
  const promises = iframesToScrape.map(async (iframe) => {
    const res = await axios.get(iframe);
    const $iframe = cheerio.load(res.data);

    // Helper function for dealing with iframe data
    function getIframeCellValue(cellValue) {
      return $iframe(`th:contains('${cellValue}')`).next().text();
    }

    // Get data from iframe
    // Company Name
    const company = $iframe("#contentBox h1 span#companyName").text();
    // Ex-Date
    const exDate = $iframe("#remarkContents span").text().split(": ")[1];

    // Dividend Type
    const divType = getIframeCellValue("Type (Regular or Special)");
    // Amount of Cash div/share
    const cashDivAmount = getIframeCellValue(
      "Amount of Cash Dividend Per Share"
    );
    // Record Date
    const recordDate = getIframeCellValue("Record Date");
    // Payment Date
    const paymentDate = getIframeCellValue("Payment Date");

    const announcement = {
      company,
      exDate,
      divType,
      cashDivAmount,
      recordDate,
      paymentDate
    };
    return announcement;
  });
  const announcements = await resolveValues(promises);

  // Get date today for reference purposes
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  const dateToday = new Date().toLocaleDateString("us-EN", dateOptions);

  // Parse data
  const announcementData = {
    date: dateToday,
    announcements
  };
  // console.log("Announcements: ", announcementData);
  return announcementData;
}

module.exports = scrape;
