require("dotenv/config")
const { BinanceWallet } = require("./lib/binance");
const { GateWallet } = require("./lib/gate");
const { MexcWallet, mexcClient } = require("./lib/mexc");
const fs = require("fs");

const CURRENCIES = JSON.parse(fs.readFileSync("wallet.json", "utf8"));

function insertCurrencies(currencies) {
  currencies.forEach((currency) => {
    if (CURRENCIES[currency.name]) {
      CURRENCIES[currency.name].amount =
        CURRENCIES[currency.name].amount + Number(currency.amount);
    }
  });
}

function log() {
  console.table(
    Object.entries(CURRENCIES).map(([key, currency]) => ({
      name: key,
      amount: currency.amount,
      price: currency.price,
      total: currency.total,
      cost: currency.cost,
    })),
    ['name', 'amount', 'price', 'total', 'cost']
  );

  console.log('=============');

  console.log(
    "Total:",
    Object.values(CURRENCIES).reduce(
      (acc, currency) => acc + currency.total,
      CURRENCIES.USDT.total
    ),
  );

  console.log('=============');

  console.log(
    "Cost:", 
    Object.values(CURRENCIES).reduce(
      (acc, currency) => acc + currency.cost,
      CURRENCIES.USDT.cost
    )
  );
}

async function main() {
  console.log('Loading...');

  const gateCurrencies = await GateWallet.getListCurrency();
  insertCurrencies(gateCurrencies);

  const mexcCurrencies = await MexcWallet.getListCurrency();
  insertCurrencies(mexcCurrencies);

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

