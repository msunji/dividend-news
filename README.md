# Dividend News
A web scraper built with Cheerio and Node.js that routinely checks Philippine Stock Market (PSE) Edge for any dividend announcements.

## What is this for?
This keeps track of cash dividend announcements from publicly listed companies on the PSE. Instead of having to manually check the PSE Edge Company Announcements page daily, this tool scrapes the page for relevant announcements and sends the results through email.

Announcements are made on weekdays - usually during trading hours. As such, this script runs once Monday-Friday around the end of trading hours.

Announcements look like this:

<p align="center">
  <img src="https://res.cloudinary.com/dxzcdb0pm/image/upload/v1692000828/portfolio/misc-screens/DivAnnouncements_hb35zi.png" alt="Screenshot of an email">
</p>

## Tech Stack
- Cheerio
  - In the [previous iteration](https://github.com/msunji/puppeteer-dividends), I used Puppeteer, but decided I didn't need to use something that complex for this project, so I went with Cheerio.
- Axios
- Node.js
- Nodemailer and Sendgrid
- Firebase

## Changelog
- May 2, 2023: Added stock code for preferred stocks
## To Do
- [x] Write scraping script with Cheerio
- [x] Run scraper + email on a schedule
- [x] Store data in Firestore
- [ ] Update email template
- [ ] (Would be nice) Send email alert when ex-date of a stock approaches
- [ ] (Would be good) To have a way to monitor any failed attempts at scraping/sending data out

## Helpful Resources and Credit
- [Responsive HTML Email Template](https://github.com/leemunroe/responsive-html-email-template) - A straightforward HTML email template
- [crontab guru](https://crontab.guru/#5_4_*_*) - A simple editor for cron schedule expressions