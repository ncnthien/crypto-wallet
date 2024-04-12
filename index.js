require("dotenv/config")
const { BinanceWallet } = require("./lib/binance");
const { GateWallet } = require("./lib/gate");
const { MexcWallet, mexcClient } = require("./lib/mexc");
const { BybitWallet } = require("./lib/bybit");
const fs = require("fs");

const CURRENCIES = JSON.parse(fs.readFileSync("wallet.json", "utf8"));

function insertCurrencies(currencies) {
  currencies.forEach((currency) => {
    if (CURRENCIES[currency.name]) {
      CURRENCIES[currency.name].amount =
        CURRENCIES[currency.name].amount + Number(currency.amount);
      if (currency.name === "USDT") {
        CURRENCIES[currency.name].cost = CURRENCIES[currency.name].amount;
      }
    }
  });
}

function log() {
  const totalWithUSDT = Object.values(CURRENCIES).reduce(
    (acc, currency) => acc + currency.total,
    CURRENCIES.USDT.amount
  )

  const total = Object.values(CURRENCIES).reduce(
    (acc, currency) => acc + currency.total,
    0
  )
  
  const totalCost = Object.values(CURRENCIES).reduce(
    (acc, currency) => acc + currency.cost,
    0
  )

  console.table(
    Object.entries(CURRENCIES).map(([key, currency]) => ({
      name: key,
      amount: currency.amount,
      price: currency.price,
      averagePrice: currency.cost / currency.amount,
      total: currency.total,
      cost: currency.cost,
      currentPercent: currency.cost * 100 / totalCost,
    }))
  );

  console.log('=============');

  console.log(
    "Total (USDT included):",
    totalWithUSDT
  );

  console.log('=============');

  console.log(
    "Total:",
    total
  );

  console.log('=============');

  console.log(
    "Cost:", 
    totalCost
  );
}

async function main() {
  console.log('Start...');

  const gateCurrencies = await GateWallet.getListCurrency();
  insertCurrencies(gateCurrencies);

  const mexcCurrencies = await MexcWallet.getListCurrency();
  insertCurrencies(mexcCurrencies);

  const bybitCurrency = await BybitWallet.getListCurrency();
  insertCurrencies(bybitCurrency);

  const binanceCurrency = await BinanceWallet.getListCurrency();
  insertCurrencies(binanceCurrency);

  await Promise.all(
    Object.entries(CURRENCIES).map(async ([key, currency]) => {
      try {
        const data = await mexcClient.tickerPrice(key + "USDT");
        CURRENCIES[key].total = Number(data.price) * currency.amount;
        CURRENCIES[key].price = Number(data.price);
      } catch (error) {}
    }),
  );

  log();
}

main();

