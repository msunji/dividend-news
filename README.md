# Dividend News
A web scraper built with Cheerio and Node.js that routinely checks Philippine Stock Market (PSE) Edge for any dividend announcements.

## What is this for?
This keeps track of cash dividend announcements from publicly listed companies on the PSE. Instead of having to manually check the PSE Edge Company Announcements page daily, this tool scrapes the page for relevant announcements and sends the results through email.

Announcements are made on weekdays - often during trading hours. As such, this script runs once Monday-Friday around the end of trading hours.

## Tech Stack
- Cheerio
  - In the [previous iteration](https://github.com/msunji/puppeteer-dividends), I used Puppeteer, but decided I didn't need to use something that complex for this project, so I went with Cheerio for this iteration.
- Axios
- Node.js
- Nodemailer and Sendgrid
- Firebase