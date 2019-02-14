const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let inflationRateArray = [],
    first,
    rest,
    table;

  for (let year = 1980; year <= 2011; ++year) {
    await page.goto(`https://www.inflation.eu/inflation-rates/united-states/historic-inflation/cpi-inflation-united-states-${year}.aspx`);
    table = await page.evaluate(() => (
      Array.from(document.querySelectorAll('form#ctl00 table.maintable tbody tr td table tbody tr td table tbody tr td table tbody')[1]
        .querySelectorAll('tr'))
      .map(tableElement => ({
        month: tableElement.children[3].innerText.split('-')[0].trim(),
        inflation: tableElement.children[4].innerText
      }))
    ));

    [first, ...rest] = table;
    inflationRateArray = [...inflationRateArray, ...rest];
  }

  fs.writeFileSync('cpi-inflation.json', JSON.stringify(inflationRateArray, null, 2));

  await browser.close();
})();