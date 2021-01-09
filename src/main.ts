const axios = require('axios')
const cheerio = require('cheerio')
const xlsx = require('node-xlsx')
const fs = require('fs')
async function init() {
    const url = 'http://quotes.money.163.com/f10/zycwzb_600519.html';
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    const titleList = [];
    const dataList = [];
    $('.scr_table .dbrow th').each((_, ele) => {
      titleList.push($(ele).text());
    });

    $('.scr_table tr')
      .eq(11)
      .find('td')
      .each((_, ele) => {
        dataList.push($(ele).text());
      });

    titleList.unshift('报告日期');
    dataList.unshift('净利润(扣除非经常性损益后)(万元)');
  const data = [titleList, ...[dataList]];
  const buffer = xlsx.build([
    {
      name: 'test',
      data,
    },
  ]);
  fs.writeFile('./test.xls', buffer, (err) => {
    if (err) throw err;
  });
}
init();